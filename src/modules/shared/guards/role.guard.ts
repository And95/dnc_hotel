import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '../../../../generated/prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requeridRules = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requeridRules) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: { role: Role } }>();

    if (!user) return false;

    const isRoleMatch = requeridRules.some((role) => user.role === role);

    return isRoleMatch;
  }
}
