import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { join } from 'path';
import { SharpUpdateFieldFilesInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
import { CreateShopDto } from './dto/shopDto';
import { ShopDocument } from './schema/shop.schema';
import { ShopService } from './shop.service';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('all')
  async getAllShops() {
    return this.shopService.getAllShops({});
  }

  @Get('single/:shopId')
  async getSingleShop(@Param('shopId') shopId: string) {
    return this.shopService.getSingleShop(shopId);
  }

  @Get()
  async getShops(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ): Promise<ShopDocument[]> {
    page = page || 1;
    perPage = perPage || 10;
    order = order || 'asc';

    return this.shopService.shops({});
  }

  @Get(':shopId')
  async getShop(@Param('shopId') shopId: string) {
    return this.shopService.shop(shopId);
  }

  @Post()
  async createShop(@Body() data: CreateShopDto): Promise<ShopDocument> {
    return this.shopService.createShop(data);
  }

  @Patch(':shopId')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'newImage',
        maxCount: 1,
      },
      {
        name: 'newBanner',
        maxCount: 1,
      },
    ]),
  )
  async updateShop(
    @Param('shopId') shopId: string,
    @Body() data: Partial<CreateShopDto>,
    @UploadedFiles(new SharpUpdateFieldFilesInterceptorPipe('shops'))
    { newImage, newBanner }: { newImage?: string; newBanner?: string },
  ): Promise<ShopDocument> {
    return this.shopService.updateShop(shopId, data, newImage, newBanner);
  }

  @Delete(':shopId')
  async deleteShop(@Param('shopId') shopId: string) {
    return this.shopService.deleteShop(shopId);
  }

  @Get('/image/:shopImage')
  async findShopImage(@Param('shopImage') shopImage: string, @Res() res) {
    const path = join(process.cwd(), 'uploads/shops/' + shopImage);
    if (fs.existsSync(path)) {
      res.sendFile(path);
    }
  }

  @Delete('/banner/:shopId')
  async deleteShopBanner(@Param('shopId') shopId: string) {
    return this.shopService.deleteShopBanner(shopId);
  }

  @Delete('/image/:shopId')
  async deleteShopImage(@Param('shopId') shopId: string) {
    return this.shopService.deleteShopImage(shopId);
  }
}
