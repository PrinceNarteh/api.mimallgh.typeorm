import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateShopDto } from 'src/modules/shops/dto/shopDto';
import { ShopService } from 'src/modules/shops/shop.service';
import { SharpFileInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
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
  @UseInterceptors(FileInterceptor('image'))
  async registerShop(
    @Body() createShopDto: CreateShopDto,
    @UploadedFile(new SharpFileInterceptorPipe('shops'))
    file?: Express.Multer.File,
  ) {
    return await this.shopService.createShop(createShopDto, file);
  }

  @UseGuards(ShopRefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.shopAuthService.refreshToken(req.user);
  }
}
