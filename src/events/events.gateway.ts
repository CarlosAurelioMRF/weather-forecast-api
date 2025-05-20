import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UserSessionCache } from './user-session-cache';

@WebSocketGateway(3002, { cors: { origin: '*', auth: false } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(private readonly userSessionCache: UserSessionCache) {}

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.headers['x-user-id'] as string;

    this.logger.log(`Client disconnected: ${userId}`);

    await this.userSessionCache.remove(userId);
  }

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.headers['x-user-id'] as string;

      await this.userSessionCache.add(userId);

      this.logger.log(`Client connected: ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error while trying to connect. Message: ${error.message}`,
      );
      client.disconnect();
    }
  }
}
