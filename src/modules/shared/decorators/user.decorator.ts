import type { User as UserType } from '../../../../generated/prisma/client';
import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: UserType;
}

export const User = createParamDecorator(
  (filter: keyof UserType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) throw new NotFoundException('User not found');

    if (filter && !(filter in user))
      throw new NotFoundException(`User ${String(filter)} not found`);

    return filter ? user[filter] : user;
  },
);
