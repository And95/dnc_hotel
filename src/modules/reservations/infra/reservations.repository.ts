import { Injectable } from '@nestjs/common';
import { IReservationRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation } from '../../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: unknown): Promise<Reservation> {
    const reservationClient = this.prisma as unknown as {
      reservation: {
        create(args: { data: unknown }): Promise<Reservation>;
      };
    };

    return reservationClient.reservation.create({ data });
  }

  async findById(id: number): Promise<Reservation> {
    const reservationClient = this.prisma as unknown as {
      reservation: {
        findUnique(args: { where: { id: number } }): Promise<Reservation>;
      };
    };

    const reservation = await reservationClient.reservation.findUnique({
      where: { id },
    });

    if (!reservation) throw new Error(`Reservation with id ${id} not found`);

    return reservation;
  }

  findAll(): Promise<Reservation[]> {
    const reservationClient = this.prisma as unknown as {
      reservation: {
        findMany(): Promise<Reservation[]>;
      };
    };

    return reservationClient.reservation.findMany();
  }

  findByUser(userId: number): Promise<Reservation[]> {
    const reservationClient = this.prisma as unknown as {
      reservation: {
        findMany(args: { where: { userId: number } }): Promise<Reservation[]>;
      };
    };

    return reservationClient.reservation.findMany({ where: { userId } });
  }
}
