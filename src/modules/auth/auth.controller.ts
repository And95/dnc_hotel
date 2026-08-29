import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthLoginDto } from './domain/dto/authLogin.dto';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';
import { AuthForgotPasswordDTO } from './domain/dto/authForgotPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: AuthLoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Patch('reset-password')
  resetPassword(@Body() { token, password }: AuthResetPasswordDTO) {
    return this.authService.resetPassword({ token, password });
  }

  @Post('forgot-password')
  forgotPassword(@Body() { email }: AuthForgotPasswordDTO) {
    if (!email) throw new BadRequestException('Email is required');
    return this.authService.forgot(email);
  }
}
