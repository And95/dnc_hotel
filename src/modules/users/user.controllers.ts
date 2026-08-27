import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDto } from './domain/dto/createUser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUsers() {
    return this.userService.listUsers();
  }

  @Get(':id')
  showUser(@Param('id') id: string) {
    return this.userService.showUserById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.userService.updateUserById(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
}
