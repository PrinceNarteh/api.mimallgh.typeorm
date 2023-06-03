import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateShopDto } from 'src/modules/shops/dto/shopDto';
import { ShopService } from 'src/modules/shops/shop.service';
import { SharpFieldFilesInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 1,
      },
      {
        name: 'banner',
        maxCount: 1,
      },
    ]),
  )
  async registerShop(
    @Body() createShopDto: CreateShopDto,
    @UploadedFiles(new SharpFieldFilesInterceptorPipe('shops'))
    { image, banner }: { image?: string; banner?: string },
  ) {
    return await this.shopService.createShop(createShopDto, image, banner);
  }

  @UseGuards(ShopRefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.shopAuthService.refreshToken(req.user);
  }
}
