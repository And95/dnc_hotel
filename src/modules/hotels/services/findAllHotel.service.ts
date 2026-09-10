import { Inject, Injectable, type InjectionToken } from '@nestjs/common';
import { REPOSITORY_TOKEN_HOTEL } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import type { Hotel } from '../../../../generated/prisma/client';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_HOTEL as InjectionToken)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const offSet = (page - 1) * limit;

    let data: Hotel[] | null = null;

    if (!data) {
      data = await this.hotelRepositories.findHotels(offSet, limit);
      data = data.map((hotel: Hotel) => {
        if (hotel.image) {
          hotel.image = `${process.env.APP_API_URL}/hotel-image/${hotel.image}`;
        }
        return hotel;
      });
    }

    const total = await this.hotelRepositories.countHotels();
    return {
      total,
      page,
      per_page: limit,
      data,
    };
  }
}
