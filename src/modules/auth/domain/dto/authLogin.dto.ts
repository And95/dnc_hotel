import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string | undefined;

  @IsString()
  @IsNotEmpty()
  password: string | undefined;
}
