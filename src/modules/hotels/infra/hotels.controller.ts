import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  Param,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { CreateHotelsService } from '../services/createHotel.service';
import { FindOneHotelsService } from '../services/findOneHotel.service';
import { FindAllHotelsService } from '../services/findAllHotel.service';
import { UpdateHotelsService } from '../services/updateHotel.service';
import { RemoveHotelsService } from '../services/removeHotel.service';
import { FindByOwnerHotelsService } from '../services/findByOwnerHotel.service';
import { FindByNameHotelsService } from '../services/findByNameHotel.service';
import { ParamId } from '../../shared/decorators/paramId.decorator';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { RoleGuard } from '../../shared/guards/role.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../../../generated/prisma/client';
import { OwnerHotelGuard } from '../../shared/guards/ownerHotel.guard';
import { User } from '../../shared/decorators/user.decorator';
import { FileValidationInterceptor } from '../../shared/interceptors/fileValidation.interceptor';
import { UploadImageHotelService } from '../services/uploadImageHotel.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelService: CreateHotelsService,
    private readonly findOneHotelService: FindOneHotelsService,
    private readonly findAllHotelService: FindAllHotelsService,
    private readonly updateHotelService: UpdateHotelsService,
    private readonly removeHotelService: RemoveHotelsService,
    private readonly findHotelByOwnerService: FindByOwnerHotelsService,
    private readonly findHotelByNameService: FindByNameHotelsService,
    private readonly uploadImageHotelService: UploadImageHotelService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@User('id') id: number, @Body() createHotelDto: CreateHotelDto) {
    return this.createHotelService.execute(createHotelDto, id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.findAllHotelService.execute(Number(page), Number(limit));
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('name')
  findName(@Query('name') name: string) {
    return this.findHotelByNameService.execute(name);
  }

  @Roles(Role.ADMIN)
  @Get('owner')
  findOwner(@User('id') id: number) {
    return this.findHotelByOwnerService.execute(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findOneHotelService.execute(id);
  }

  @UseInterceptors(FileInterceptor('image'), FileValidationInterceptor)
  @Patch('image/:hotelId')
  uploadImage(
    @Param('hotelId') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/*',
          }),
          new MaxFileSizeValidator({ maxSize: 900 * 1024 }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.uploadImageHotelService.execute(id, image.filename);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@ParamId() id: number, @Body() updateHotelDto: UpdateHotelDto) {
    return this.updateHotelService.execute(id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@ParamId() id: number) {
    return this.removeHotelService.execute(id);
  }
}
