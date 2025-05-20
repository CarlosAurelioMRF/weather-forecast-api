import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from '~/weather/weather.service';

@Controller('weathers')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/forecast-by-city')
  getForecastByCity(@Query('cityName') cityName: string) {
    return this.weatherService.getForecastByCity(cityName);
  }

  @Get('/forecast-by-coordinates')
  getForecastByCoodinates(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    return this.weatherService.getForecastByCoodinates(latitude, longitude);
  }
}
