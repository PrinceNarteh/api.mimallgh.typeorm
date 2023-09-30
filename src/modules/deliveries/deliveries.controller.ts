import {
  Body,
  Controller,
  Query,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import {
  CreateDeliveryDto,
  GetDeliveriesByCompanyDto,
} from './dto/deliveryDto';
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
  async getDeliveries(@Query() query: { [key: string]: string }) {
    return this.deliveriesService.getAllDeliveries(query);
  }

  @Post('/company')
  async getDeliveriesByCompany(
    @Body() { company_id }: GetDeliveriesByCompanyDto,
  ) {
    return this.deliveriesService.deliveriesByCompany(company_id);
  }

  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveriesService.createDelivery(createDeliveryDto);
  }

  @Patch()
  async updateDelivery(
    @Param('deliveryId') deliveryId: string,
    @Body() createDeliveryDto: CreateDeliveryDto,
  ) {
    return this.deliveriesService.createDelivery(createDeliveryDto);
  }
}
