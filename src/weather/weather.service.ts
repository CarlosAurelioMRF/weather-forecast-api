import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponseDto } from '~/common/dto';
import { ForecastResponseDto, ForecastDto } from '~/weather/dto';
import { ForecastMapper } from '~/weather/mappers';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getForecastByCity(
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

      return {
        success: true,
        data: ForecastMapper.mapFromApiResponse(response.data),
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to fetch forecast for city: ${cityName}. Error: ${error?.response?.data?.error?.message ?? error.message}`,
      };
    }
  }

  async getForecastByCoodinates(
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

      return {
        success: true,
        data: ForecastMapper.mapFromApiResponse(response.data),
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to fetch forecast with coordinates: ${latitude}, ${longitude}. Error: ${error?.response?.data?.error?.message ?? error.message}`,
      };
    }
  }
}
