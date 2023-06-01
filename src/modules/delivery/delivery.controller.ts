import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Delivery } from 'src/entities/delivery.entity';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/deliveryDto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':deliveryId')
  async getDelivery(
    @Param('deliveryId') deliveryId: string,
  ): Promise<Delivery> {
    return this.deliveryService.getDelivery(deliveryId);
  }

  @Get()
  async getAllDeliveries() {
    return this.deliveryService.getAllDeliveries();
  }

  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery(createDeliveryDto);
  }
}
