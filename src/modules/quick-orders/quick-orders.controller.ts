import { Controller, Param, Get, Post, Body, Query } from '@nestjs/common';
import { QuickOrdersService } from './quick-orders.service';
import { CreateQuickOrderDto } from './dto/quickOrderDto';

@Controller('quick-orders')
export class QuickOrdersController {
  constructor(private readonly orderService: QuickOrdersService) {}

  @Get()
  async getAllQuickOrders(@Query() param: { [key: string]: string }) {
    return this.orderService.getAllQuickOrders(param);
  }

  @Get(':orderId')
  async getQuickOrder(
    @Param(':orderId') orderId: string,
    @Query('relations') relations?: boolean,
  ) {
    return this.orderService.getQuickOrder(orderId, relations);
  }

  @Post()
  async createQuickOrder(@Body() order: CreateQuickOrderDto) {
    return this.orderService.createQuickOrder(order);
  }
}
