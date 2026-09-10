import type { Hotel } from '../../../../generated/prisma/client';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDto, id: number): Promise<Hotel> {
    return this.prisma.hotel.create({
      data: {
        ...data,
        name: data.name!,
        description: data.description!,
        price: data.price!,
        address: data.address!,
        ownerId: id,
      },
    });
  }

  findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({
      where: { id: Number(id) },
      include: { owner: true },
    });
  }
  findHotelByName(name: string): Promise<Hotel[] | null> {
    return this.prisma.hotel.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  findHotels(offSet: number, limit: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({
      take: limit,
      skip: offSet,
      include: { owner: true },
    });
  }

  countHotels(): Promise<number> {
    return this.prisma.hotel.count();
  }

  findHotelByOwner(ownerId: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({ where: { ownerId } });
  }

  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({ where: { id }, data });
  }
  deleteHotel(id: number): Promise<Hotel> {
    return this.prisma.hotel.delete({ where: { id } });
  }
}
