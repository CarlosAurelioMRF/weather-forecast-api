import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WeatherModule,
    EventsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
