import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class ShopRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-shop',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      ignoreExpiration: false,
      secretOrKey: `6UNZ7rWXy9gjBo965rWKxpy9xAo7D08kBuV7kGwuFiw=`,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, shopCode: payload.shopCode };
  }
}
