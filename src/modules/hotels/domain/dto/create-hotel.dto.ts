import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string | undefined;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  description: string | undefined;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number | undefined;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  address: string | undefined;

  @IsNumber()
  @IsOptional()
  ownerId: number | undefined;
}
