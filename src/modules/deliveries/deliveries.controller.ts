import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Delivery } from 'src/entities/delivery.entity';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/deliveryDto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get(':deliveryId')
  async getDelivery(
    @Param('deliveryId') deliveryId: string,
  ): Promise<Delivery> {
    return this.deliveriesService.getDelivery(deliveryId);
  }

  @Get()
  async getAllDeliveries() {
    return this.deliveriesService.getAllDeliveries();
  }

  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    console.log(createDeliveryDto);
    return this.deliveriesService.createDelivery(createDeliveryDto);
  }
}
