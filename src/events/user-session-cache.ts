import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserCacheDto } from '~/common/dto';

@Injectable()
export class UserSessionCache {
  public key: string = 'userKey';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getUsersConnected(): Promise<UserCacheDto[]> {
    const usersConnected =
      (await this.cacheManager.get<UserCacheDto[]>(this.key)) ?? [];

    return usersConnected;
  }

  async add(userId: string): Promise<UserCacheDto[]> {
    const usersConnected = await this.getUsersConnected();

    const userConnected = usersConnected.find(
      (userConnected) => userConnected.userId === userId,
    );

    if (!userConnected) {
      const updatedUsers = [...usersConnected, { userId }];

      await this.cacheManager.set(this.key, updatedUsers, 0);

      return updatedUsers;
    }

    return usersConnected;
  }

  async remove(userId: string): Promise<UserCacheDto[]> {
    const usersConnected = await this.getUsersConnected();

    const updatedUsers =
      usersConnected.filter(
        (userConnected) => userConnected.userId !== userId,
      ) ?? [];

    await this.cacheManager.set(this.key, updatedUsers, 0);

    return updatedUsers;
  }

  async updateCityName(userId: string, cityName: string): Promise<void> {
    const usersConnected = await this.getUsersConnected();

    const updatedUsers = usersConnected.map((userConnected) => {
      if (userConnected.userId === userId) {
        return { ...userConnected, cityName };
      }

      return userConnected;
    });

    await this.cacheManager.set(this.key, updatedUsers, 0);
  }
}
