import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Shop } from 'src/entities/shop.entity';
import { ShopService } from 'src/modules/shops/shop.service';

@Injectable()
export class ShopAuthService {
  constructor(
    private readonly shopService: ShopService,
    private jwtService: JwtService,
  ) {}

  async validateShop(shopCode: string, password: string) {
    const shop = await this.shopService.findShopByShopCode(shopCode);
    if (shop && (await bcrypt.compare(password, shop.password))) {
      const { password, ...result } = shop;
      return result;
    }
    return null;
  }

  async login(shop: Shop) {
    let payload = {
      id: shop.id,
      name: shop.name,
      shopCode: shop.shopCode,
    };

    return {
      ...shop,
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(shop: Shop) {
    let payload = {
      id: shop.id,
      name: shop.name,
      shopCode: shop.shopCode,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
