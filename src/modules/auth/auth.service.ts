import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../../../generated/prisma/browser';
import { AuthLoginDto } from './domain/dto/authLogin.dto';
import { UserService } from '../users/user.services';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/domain/dto/createUser.dto';
import { AuthRegisterDto } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';
import { JwtPayload, ValidateTokenDTO } from './domain/dto/validateToken.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { templateHTML } from './utils/templateHTML';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async generateJwtToken(
    user: User,
    expiresIn: JwtSignOptions['expiresIn'] = '1d',
  ): Promise<{ access_token: string }> {
    const payload = { sub: user.id, name: user.name };
    const options: JwtSignOptions = {
      expiresIn: expiresIn,
      issuer: 'dnc_hotel',
      audience: 'users',
    };

    return { access_token: await this.jwtService.signAsync(payload, options) };
  }

  async login({ email, password }: AuthLoginDto) {
    if (!email) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const passwordMatches = password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.generateJwtToken(user);
  }

  async register(body: AuthRegisterDto) {
    const newUser: CreateUserDto = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role ?? 'USER',
    };
    const user = await this.userService.createUser(newUser);

    return this.generateJwtToken(user);
  }

  async resetPassword({ token, password }: AuthResetPasswordDTO) {
    if (!token) throw new UnauthorizedException('Invalid token');

    try {
      const result = await this.validateToken(token);

      if (!result.valid || !result.decoded)
        throw new UnauthorizedException('Invalid token');

      const user = await this.userService.updateUserById(
        Number(result.decoded.sub),
        {
          password,
        },
      );

      return this.generateJwtToken(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async forgot(email: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email is incorrect');
    }

    const token = await this.generateJwtToken(user, '30m');

    //Enviar o email com o token jwt para resetar a senha
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password - DNC Hotel',
      html: templateHTML(user.name, token.access_token),
    });

    return `A verification code has been sent to ${email}`;
  }

  async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
        issuer: 'dnc_hotel',
        audience: 'users',
      });

      return {
        valid: true,
        decoded,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Token validation failed';

      return {
        valid: false,
        message,
      };
    }
  }
}
