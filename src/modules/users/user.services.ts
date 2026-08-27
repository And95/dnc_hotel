import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../../generated/prisma/client';
import { UpdateUserDto } from './domain/dto/updateUser.dto';
import { CreateUserDto } from './domain/dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers() {
    return await this.prisma.user.findMany();
  }

  async showUserById(id: number) {
    const user = await this.isIdExist(id);
    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name: body.name!,
        email: body.email!,
        password: body.password!,
        ...(body.role !== undefined ? { role: body.role } : { role: 'USER' }),
      },
    });
  }

  async updateUserById(id: number, body: UpdateUserDto): Promise<User> {
    await this.isIdExist(id);

    return await this.prisma.user.update({
      where: { id },
      data: body,
    });
  }

  async deleteUserById(id: number) {
    await this.isIdExist(id);

    return await this.prisma.user.delete({ where: { id } });
  }

  private async isIdExist(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
      //throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
