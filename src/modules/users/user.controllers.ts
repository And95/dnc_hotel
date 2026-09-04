import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDto } from './domain/dto/updateUser.dto';
import { ParamId } from '../shared/decorators/paramId.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { Role, type User as UserType } from '../../../generated/prisma/client';
import { RoleGuard } from '../shared/guards/role.guard';
import { User } from '../shared/decorators/user.decorator';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserMatchGuard } from '../shared/guards/userMatch.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(AuthGuard, RoleGuard, ThrottlerGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@SkipThrottle()
  //@Throttle({ default: { limit: 3, ttl: 50000 } })
  @Throttle({ default: { limit: 20, ttl: 500000 } })
  @Get()
  listUsers(@User('email') user: UserType) {
    console.log('User:', user); // Log the user for debugging
    return this.userService.listUsers();
  }

  @Get(':id')
  showUser(@ParamId() id: number) {
    return this.userService.showUserById(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(UserMatchGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUserById(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteUser(@ParamId() id: number) {
    return this.userService.deleteUserById(id);
  }
}
