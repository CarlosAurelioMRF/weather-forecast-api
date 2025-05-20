export class ForecastDto {
  locationName: string;
  localtime: string;
  humidity: number;
  conditionIcon: string;
  temperature: number;
  forecastDay: Array<{
    date: string;
    avghumidity: number;
    maxTemp: number;
    minTemp: number;
    condition: string;
  }>;
}
