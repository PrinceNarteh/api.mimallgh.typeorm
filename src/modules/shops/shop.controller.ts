import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Shop } from 'src/entities/shop.entity';
import { FindManyOptions, ILike } from 'typeorm';
import { CreateShopDto } from './dto/shopDto';
import { ShopService } from './shop.service';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  async getShops(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
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

    const options = { findOptions, currentPage: perPage };

    return await this.shopService.shops(options);
  }

  @Get(':shopId')
  async getShop(@Param('shopId') shopId: string) {
    return this.shopService.shop(shopId);
  }

  @Post()
  async createShop(@Body() data: CreateShopDto) {
    return this.shopService.createShop(data);
  }

  @Patch(':shopId')
  async updateShop(
    @Param('shopId') shopId: string,
    @Body() data: Partial<CreateShopDto>,
  ) {
    return this.shopService.updateShop(shopId, data);
  }

  @Delete(':shopId')
  async deleteShop(@Param('shopId') shopId: string) {
    return this.shopService.deleteShop(shopId);
  }
}
