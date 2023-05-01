import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateShopDto } from 'src/modules/shops/dto/shopDto';
import { ShopService } from 'src/modules/shops/shop.service';
import { ShopLocalAuthGuard } from './guards/local-auth.guard';
import { ShopRefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { ShopAuthService } from './shop-auth.service';

@Controller('shop-auth')
export class ShopAuthController {
  constructor(
    private shopAuthService: ShopAuthService,
    private shopService: ShopService,
  ) {}

  @UseGuards(ShopLocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.shopAuthService.login(req.user);
  }

  @Post('register')
  async registerShop(@Body() createShopDto: CreateShopDto) {
    return await this.shopService.createShop(createShopDto);
  }

  @UseGuards(ShopRefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.shopAuthService.refreshToken(req.user);
  }
}
