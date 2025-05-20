import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { EventsGateway } from './events.gateway';
import { UserSessionCache } from './user-session-cache';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  providers: [EventsGateway, UserSessionCache],
  exports: [EventsGateway, UserSessionCache],
})
export class EventsModule {}
