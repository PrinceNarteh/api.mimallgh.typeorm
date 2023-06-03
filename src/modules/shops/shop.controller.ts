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
import { join } from 'path';
import { Shop } from 'src/entities/shop.entity';
import { FindManyReturnType } from 'src/types/findManyOptions';
import { FindManyOptions, ILike } from 'typeorm';
import { CreateShopDto } from './dto/shopDto';
import { ShopService } from './shop.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SharpFieldFilesInterceptorPipe } from 'src/shared/pipes/sharp.pipe';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('all')
  async getAllShops() {
    return this.shopService.getAllShops();
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
  ): Promise<FindManyReturnType<Shop>> {
    page = page || 1;
    perPage = perPage || 10;
    order = order || 'asc';

    const findOptions: FindManyOptions<Shop> = {
      take: perPage,
      skip: (page - 1) * perPage,
      order: {
        id: order,
      },
    };

    if (search) {
      findOptions.where = [
        { name: ILike(`%${search}%`) },
        { shopCode: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];
    }

    const options = { findOptions, perPage, currentPage: page };

    return await this.shopService.shops(options);
  }

  @Get(':shopId')
  async getShop(@Param('shopId') shopId: string) {
    return this.shopService.shop(shopId);
  }

  @Post()
  async createShop(@Body() data: CreateShopDto): Promise<Shop> {
    return this.shopService.createShop(data);
  }

  @Patch(':shopId')
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
  async updateShop(
    @Param('shopId') shopId: string,
    @Body() data: Partial<CreateShopDto>,
    @UploadedFiles(new SharpFieldFilesInterceptorPipe('shops'))
    { image, banner }: { image?: string; banner?: string },
  ): Promise<Shop> {
    return this.shopService.updateShop(shopId, data, image, banner);
  }

  @Delete(':shopId')
  async deleteShop(@Param('shopId') shopId: string) {
    return this.shopService.deleteShop(shopId);
  }

  @Get('/image/:shopImage')
  async findShopImage(@Param('shopImage') shopImage: string, @Res() res) {
    res.sendFile(join(process.cwd(), 'uploads/shops/' + shopImage));
  }

  @Delete('/banner/:shopId')
  async deleteShopBanner(@Param('shopId') shopId: string) {
    return this.shopService.deleteShopImage(shopId);
  }

  @Delete('/image/:shopId')
  async deleteShopImage(@Param('shopId') shopId: string) {
    return this.shopService.deleteShopImage(shopId);
  }
}
