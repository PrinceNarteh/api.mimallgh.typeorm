import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `lHRqk48b01ueKau1u3CJvH2TozcWdSaEKaBGbBZO8Pg=`,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, role: payload.role };
  }
}
