import { Controller, Get, Headers, Query } from '@nestjs/common';
import { WeatherService } from '~/weather/weather.service';

@Controller('weathers')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/forecast-by-city')
  getForecastByCity(
    @Headers('x-user-id') userId: string,
    @Query('cityName') cityName: string,
  ) {
    return this.weatherService.getForecastByCity(userId, cityName);
  }

  @Get('/forecast-by-coordinates')
  getForecastByCoodinates(
    @Headers('x-user-id') userId: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    return this.weatherService.getForecastByCoodinates(
      userId,
      latitude,
      longitude,
    );
  }
}
