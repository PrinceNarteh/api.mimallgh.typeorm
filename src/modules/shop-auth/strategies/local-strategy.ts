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
      usernameField: 'shopCode',
    });
  }

  async validate(shopCode: string, password: string) {
    const shop = await this.shopService.validateShop(shopCode, password);
    if (!shop) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return shop;
  }
}
