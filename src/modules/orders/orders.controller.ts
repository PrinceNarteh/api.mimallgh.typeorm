import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/orderDto';
import { createFindOptions } from 'src/utils/findManyOptions';
import { ShopJwtGuard } from '../shops/auth/guards/jwt-auth.guard';
import { JwtGuard } from '../users/auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  async getOrders(
    @Query('perPage') perPage?: number,
    @Query('page') page?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    const findManyOptions = createFindOptions({ order, page, perPage, search });
    return this.orderService.getAllOrders(findManyOptions);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Get(':userId/user')
  async getOrdersByUser(
    @Param() orderId: string,
    @Query('perPage') perPage?: number,
    @Query('page') page?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    const findManyOptions = createFindOptions({ order, page, perPage, search });
    return this.orderService.getOrdersByUser(orderId, findManyOptions);
  }

  @UseGuards(ShopJwtGuard)
  @Get(':shopId/shop')
  async getOrdersByShop(
    @Param('shopId') shopId: string,
    @Query('perPage') perPage?: number,
    @Query('page') page?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    const findManyOptions = createFindOptions({ order, page, perPage, search });
    return this.orderService.getOrdersByShop(shopId, findManyOptions);
  }

  @UseGuards(ShopJwtGuard)
  @Get(':orderId/order')
  async getOrderByShop(@Request() req, @Param('orderId') orderId: string) {
    return this.orderService.getOrderByShop(req.user.id, orderId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(req.user, createOrderDto);
  }

  @Delete(':orderId')
  async deleteOrder(@Param() orderId: string) {
    return this.orderService.deleteOrder(orderId);
  }
}
