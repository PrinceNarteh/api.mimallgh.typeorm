import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/users/user.service';
import { UserDocument } from '../schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailOrPhoneNumber: string, password: string) {
    const user = await this.userService.getUserByEmailOrPhoneNumber(
      emailOrPhoneNumber,
    );
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateAdmin(emailOrPhoneNumber: string, password: string) {
    const user = await this.userService.getUserByEmailOrPhoneNumber(
      emailOrPhoneNumber,
    );
    if (
      user &&
      user.role === 'admin' &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDocument) {
    let payload = {
      id: user.id,
      role: user.role,
    };

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(user: UserDocument) {
    let payload = {
      id: user.id,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
