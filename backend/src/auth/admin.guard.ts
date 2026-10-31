import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authentication token required for admin access');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');
    const admin = await this.authService.verifyAdminToken(token);

    if (!admin) {
      throw new UnauthorizedException('Invalid or expired admin session token');
    }

    request.admin = admin;
    return true;
  }
}
