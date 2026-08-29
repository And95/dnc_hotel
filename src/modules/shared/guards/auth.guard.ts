import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../users/user.services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers?: Record<string, string | undefined>;
      user?: unknown;
    }>();

    const { authorization } = request.headers ?? {};

    if (
      !authorization ||
      !request.user ||
      !authorization.startsWith('Bearer ')
    ) {
      return false;
    }

    const token = authorization.split(' ')[1];
    const { valid, decoded } = await this.authService.validateToken(token);
    if (!valid || !decoded || !decoded.sub) return false;
    const user = await this.userService.showUserById(Number(decoded.sub));
    if (!user) return false;
    request.user = user;
    return true;
  }
}
