import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateShopDto } from 'src/modules/shops/dto/shopDto';
import { ShopService } from 'src/modules/shops/shop.service';
import { ShopLocalAuthGuard } from './guards/local-auth.guard';
import { ShopRefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { ShopAuthService } from './shop-auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { customAlphabet } from 'nanoid/async';
import { SharpFileInterceptorPipe } from 'src/shared/pipes/sharp.pipe';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

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
