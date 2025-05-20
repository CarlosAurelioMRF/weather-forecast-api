import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { EventsModule } from '~/events/events.module';

@Module({
  imports: [HttpModule, EventsModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
