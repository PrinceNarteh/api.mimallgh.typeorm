import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: `lHRqk48b01ueKau1u3CJvH2TozcWdSaEKaBGbBZO8Pg=`,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}
