import { Controller, Param, Get, Post, Body } from '@nestjs/common';
import { QuickOrdersService } from './quick-orders.service';
import { CreateQuickOrderDto } from './dto/quickOrderDto';

@Controller('quick-orders')
export class QuickOrdersController {
  constructor(private readonly orderService: QuickOrdersService) {}

  @Get()
  async getAllQuickOrders(@Param() param: { [key: string]: string }) {
    return this.orderService.getAllQuickOrders(param);
  }

  @Post()
  async createQuickOrder(@Body() order: CreateQuickOrderDto) {
    return this.orderService.createQuickOrder(order);
  }
}
