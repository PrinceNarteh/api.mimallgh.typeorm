import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/deliveryDto';
import { DeliveryDocument } from './schema/delivery.schema';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get(':deliveryId')
  async getDelivery(
    @Param('deliveryId') deliveryId: string,
  ): Promise<DeliveryDocument> {
    return this.deliveriesService.getDelivery(deliveryId);
  }

  @Get()
  async getAllDeliveries() {
    return this.deliveriesService.getAllDeliveries({});
  }

  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.createDelivery(createDeliveryDto);
  }
}
