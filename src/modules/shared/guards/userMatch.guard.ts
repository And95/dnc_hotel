import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: { id: number } }>();
    const id = request.params.id;
    const user = request.user;

    if (user.id !== Number(id)) {
      throw new UnauthorizedException(
        'You are not allowed to perform this operation',
      );
    }

    return true;
  }
}
