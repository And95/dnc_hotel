import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../../../generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers() {
    return await this.prisma.user.findMany();
  }

  async showUserById(id: string) {
    const user = await this.isIdExist(id);
    return user;
  }

  async createUser(body: any): Promise<User> {
    return await this.prisma.user.create({ data: body });
  }

  async updateUserById(id: string, body: any): Promise<User> {
    await this.isIdExist(id);

    return await this.prisma.user.update({
      where: { id: Number(id) },
      data: body,
    });
  }

  async deleteUserById(id: string) {
    await this.isIdExist(id);

    return await this.prisma.user.delete({ where: { id: Number(id) } });
  }

  private async isIdExist(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
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
