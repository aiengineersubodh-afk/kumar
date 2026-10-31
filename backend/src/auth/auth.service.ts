import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StoreService } from '../common/store.service.js';
import { AdminProfile } from '../common/types.js';
import * as crypto from 'crypto';

interface ActiveSession {
  token: string;
  admin: AdminProfile;
  expiresAt: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private activeSessions = new Map<string, ActiveSession>();
  private defaultAdminPassword: string;

  constructor(
    private readonly storeService: StoreService,
    private readonly configService: ConfigService
  ) {
    this.defaultAdminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'ManyMorgan2026!Admin';
  }

  async login(email: string, password: string): Promise<{ token: string; admin: AdminProfile }> {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if Supabase Auth is configured
    const supabase = this.storeService.getSupabaseClient();
    if (this.storeService.isUsingSupabase() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!error && data.user) {
        let admin = await this.storeService.getAdminByEmail(normalizedEmail);
        if (!admin) {
          admin = {
            id: data.user.id,
            email: data.user.email || normalizedEmail,
            fullName: data.user.user_metadata?.full_name || 'Authorized Administrator',
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        const token = this.generateToken(admin);
        return { token, admin };
      }
    }

    // Standard credential validation (Local / Seed admin)
    const admin = await this.storeService.getAdminByEmail(normalizedEmail);
    if (!admin || !admin.isActive) {
      this.logger.warn(`Failed login attempt for unknown or inactive email: ${normalizedEmail}`);
      throw new UnauthorizedException('Invalid administrator credentials');
    }

    if (password !== this.defaultAdminPassword) {
      this.logger.warn(`Invalid password attempt for admin: ${normalizedEmail}`);
      throw new UnauthorizedException('Invalid administrator credentials');
    }

    const token = this.generateToken(admin);
    this.logger.log(`Admin authenticated successfully: ${admin.email} (${admin.role})`);
    return { token, admin };
  }

  async verifyAdminToken(token: string): Promise<AdminProfile | null> {
    if (!token) return null;

    const session = this.activeSessions.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.activeSessions.delete(token);
      return null;
    }

    return session.admin;
  }

  async logout(token: string): Promise<boolean> {
    if (this.activeSessions.has(token)) {
      this.activeSessions.delete(token);
      return true;
    }
    return false;
  }

  private generateToken(admin: AdminProfile): string {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const token = `mm_admin_${randomBytes}`;
    const oneDayMs = 24 * 60 * 60 * 1000;

    this.activeSessions.set(token, {
      token,
      admin,
      expiresAt: Date.now() + oneDayMs,
    });

    return token;
  }
}
