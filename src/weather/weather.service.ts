import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiResponseDto } from '~/common/dto';
import { EventsGateway } from '~/events/events.gateway';
import { UserSessionCache } from '~/events/user-session-cache';
import { ForecastResponseDto, ForecastDto } from '~/weather/dto';
import { ForecastMapper } from '~/weather/mappers';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly userSessionCache: UserSessionCache,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateConnectedUsers() {
    this.logger.debug('Updating weather data every 10 minutes');

    const usersConnected = await this.userSessionCache.getUsersConnected();

    for (const userConnected of usersConnected) {
      if (!userConnected.cityName) {
        this.logger.debug(`User ${userConnected.userId} has no city name`);
        continue;
      }

      this.logger.debug(
        `User ${userConnected.userId} is connected to city ${userConnected.cityName}`,
      );

      const { success, data } = await this.getForecastByCity(
        userConnected.userId,
        userConnected.cityName,
      );

      if (!success) {
        this.logger.error(
          `Failed to fetch forecast for user ${userConnected.userId} in city ${userConnected.cityName}`,
        );
        continue;
      }

      this.logger.debug(
        `User ${userConnected.userId} has been updated with city ${userConnected.cityName}`,
      );

      this.eventsGateway.server.emit(
        `${userConnected.userId}-location-update`,
        data,
      );
    }
  }

  async getForecastByCity(
    userId: string,
    cityName: string,
  ): Promise<ApiResponseDto<ForecastDto>> {
    const apiKey = this.configService.get<string>('API_KEY');

    try {
      const response = await this.httpService
        .get<ForecastResponseDto>(
          `https://api.weatherapi.com/v1/forecast.json?q=${cityName}&days=5&key=${apiKey}`,
        )
        .toPromise();

      if (!response) {
        return {
          success: false,
          message: `Failed to fetch forecast for city: ${cityName}`,
        };
      }

      const forecast = ForecastMapper.mapFromApiResponse(response.data);

      await this.userSessionCache.updateCityName(userId, forecast.locationName);

      return {
        success: true,
        data: forecast,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to fetch forecast for city: ${cityName}. Error: ${error?.response?.data?.error?.message ?? error.message}`,
      };
    }
  }

  async getForecastByCoodinates(
    userId: string,
    latitude: number,
    longitude: number,
  ): Promise<ApiResponseDto<ForecastDto>> {
    const apiKey = this.configService.get<string>('API_KEY');

    try {
      const response = await this.httpService
        .get<ForecastResponseDto>(
          `https://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}&days=5&key=${apiKey}`,
        )
        .toPromise();

      if (!response) {
        return {
          success: false,
          message: `Failed to fetch forecast with coordinates: ${latitude}, ${longitude}`,
        };
      }

      const forecast = ForecastMapper.mapFromApiResponse(response.data);

      await this.userSessionCache.updateCityName(userId, forecast.locationName);

      return {
        success: true,
        data: forecast,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to fetch forecast with coordinates: ${latitude}, ${longitude}. Error: ${error?.response?.data?.error?.message ?? error.message}`,
      };
    }
  }
}
