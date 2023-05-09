import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(Strategy, 'admin-local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'emailOrPhoneNumber',
    });
  }

  async validate(emailOrPhoneNumber: string, password: string) {
    const user = await this.authService.validateAdmin(
      emailOrPhoneNumber,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return user;
  }
}
