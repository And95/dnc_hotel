import { ReservationStatus } from '../../../../../generated/prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  hotelId: number | undefined;

  @IsString()
  @IsNotEmpty()
  checkIn: string | undefined;

  @IsString()
  @IsNotEmpty()
  checkOut: string | undefined;

  @IsEnum(ReservationStatus as object)
  @IsOptional()
  @Transform((value) => value ?? ('PENDING' as ReservationStatus))
  status?: ReservationStatus;
}
