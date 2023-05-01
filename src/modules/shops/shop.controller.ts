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
import { CreateShopDto } from './dto/shopDto';
import { ShopService } from './shop.service';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  async getShops(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return await this.shopService.shops({
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      order: {
        updatedAt: order,
      },
    });
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
