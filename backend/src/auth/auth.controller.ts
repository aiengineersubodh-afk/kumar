import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email and password are required');
    }
    return this.authService.login(body.email, body.password);
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader?: string) {
    if (!authHeader) return { success: true };
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const success = await this.authService.logout(token);
    return { success };
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader?: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const admin = await this.authService.verifyAdminToken(token);
    if (!admin) {
      throw new UnauthorizedException('Session expired or invalid');
    }
    return { admin };
  }
}
