import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ForecastResponseDto, ForecastDto } from '~/weather/dto';
import { ForecastMapper } from '~/weather/mappers';

@Injectable()
export class WeatherService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getForecastByCity(cityName: string): Promise<ForecastDto | null> {
    const apiKey = this.configService.get<string>('API_KEY');

    const response = await this.httpService
      .get<ForecastResponseDto>(
        `https://api.weatherapi.com/v1/forecast.json?q=${cityName}&days=5&key=${apiKey}`,
      )
      .toPromise();

    if (!response) {
      return null;
    }

    return ForecastMapper.mapFromApiResponse(response.data);
  }

  async getForecastByCoodinates(
    latitude: number,
    longitude: number,
  ): Promise<ForecastDto | null> {
    const apiKey = this.configService.get<string>('API_KEY');

    const response = await this.httpService
      .get<ForecastResponseDto>(
        `https://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}&days=5&key=${apiKey}`,
      )
      .toPromise();

    if (!response) {
      return null;
    }

    return ForecastMapper.mapFromApiResponse(response.data);
  }
}
