import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../../../../generated/prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @IsEmail()
  @IsNotEmpty()
  email: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string | undefined;

  @IsString()
  @IsEnum(Role)
  role: Role | undefined;

  @IsOptional()
  avatar?: string;
}
