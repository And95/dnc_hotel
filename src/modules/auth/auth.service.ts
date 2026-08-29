import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../../../generated/prisma/browser';
import { AuthLoginDto } from './domain/dto/authLogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../users/user.services';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/domain/dto/createUser.dto';
import { AuthRegisterDto } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async generateJwtToken(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, name: user.name };
    const options: JwtSignOptions = {
      expiresIn: '1h',
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
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.userService.updateUserById(decoded.sub, {
        password,
      });

      return this.generateJwtToken(user);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
