import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class ShopJwtStrategy extends PassportStrategy(Strategy, 'jwt-shop') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `6UNZ7rWXy9gjBo965rWKxpy9xAo7D08kBuV7kGwuFiw=`,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, shopCode: payload.shopCode };
  }
}
