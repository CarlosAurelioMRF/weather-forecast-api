import { ForecastResponseDto, ForecastDto } from '~/weather/dto';

export class ForecastMapper {
  public static mapFromApiResponse = (
    forecastResponse: ForecastResponseDto,
  ): ForecastDto => ({
    locationName: forecastResponse.location.name,
    localtime: forecastResponse.location.localtime,
    humidity: forecastResponse.current.humidity,
    conditionIcon: forecastResponse.current.condition.icon,
    temperature: forecastResponse.current.temp_c,
    forecastDay: forecastResponse.forecast.forecastday.map((day) => ({
      date: day.date,
      avghumidity: day.day.avghumidity,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      condition: day.day.condition.text,
    })),
  });
}
