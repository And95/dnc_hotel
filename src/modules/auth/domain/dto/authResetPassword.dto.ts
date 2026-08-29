import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class AuthResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string | undefined;

  @IsJWT()
  @IsNotEmpty()
  token: string | undefined;
}
