import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateReservationsService } from '../services/createReservations.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { User } from '../../shared/decorators/user.decorator';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { ParamId } from '../../shared/decorators/paramId.decorator';
import { FindByIdReservationsService } from '../services/findByIdReservations.service';
import { Role } from '../../../../generated/prisma/client';
import { RoleGuard } from '../../shared/guards/role.guard';
import { Roles } from '../../shared/decorators/roles.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
  ) {}

  @Roles(Role.USER)
  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDto) {
    return this.createReservationsService.create(id, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Get('user')
  findByUser(@User('id') id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findByIdReservationsService.execute(id);
  }
}
