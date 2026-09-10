import { Inject, Injectable, type InjectionToken } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositories';

@Injectable()
export class RemoveHotelsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL as InjectionToken)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(id: number) {
    return await this.hotelRepositories.deleteHotel(id);
  }
}
