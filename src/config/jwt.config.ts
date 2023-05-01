import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'lHRqk48b01ueKau1u3CJvH2TozcWdSaEKaBGbBZO8Pg=',
  signOptions: {
    expiresIn: '15m',
  },
};
