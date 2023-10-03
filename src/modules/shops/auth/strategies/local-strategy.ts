import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ShopAuthService } from '../shop-auth.service';

@Injectable()
export class ShopLocalStrategy extends PassportStrategy(
  Strategy,
  'local-shop',
) {
  constructor(private shopService: ShopAuthService) {
    super({
      usernameField: 'shop_code',
    });
  }

  async validate(shop_code: string, password: string) {
    console.log({ shop_code, password });
    const shop = await this.shopService.validateShop(shop_code, password);
    if (!shop) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return shop;
  }
}
