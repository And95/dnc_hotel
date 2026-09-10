import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { FindOneHotelsService } from '../../hotels/services/findOneHotel.service';

@Injectable()
export class OwnerHotelGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly hotelService: FindOneHotelsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      params: { id: string };
      user?: { id: string };
    }>();
    const hotelId = request.params.id;
    const user = request.user;

    if (!user) return false;

    const hotel = await this.hotelService.execute(Number(hotelId));

    if (!hotel) return false;

    return hotel.ownerId === Number(user.id);
  }
}
