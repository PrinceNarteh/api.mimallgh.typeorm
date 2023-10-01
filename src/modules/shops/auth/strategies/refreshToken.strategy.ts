import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class ShopRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-shop',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
      secretOrKey: `6UNZ7rWXy9gjBo965rWKxpy9xAo7D08kBuV7kGwuFiw=`,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, shopCode: payload.shopCode };
  }
}
