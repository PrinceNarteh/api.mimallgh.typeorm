import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { DeliveryCompaniesService } from '../delivery-companies/delivery-companies.service';
import { DeliveryRepository } from './deliveries.repository';
import { CreateDeliveryDto } from './dto/deliveryDto';
import { DeliveryDocument } from './schema/delivery.schema';

@Injectable()
export class DeliveriesService {
  constructor(
    private readonly deliveryRepo: DeliveryRepository,
    private readonly deliverCompaniesService: DeliveryCompaniesService,
  ) {}

  async getDelivery(id: string): Promise<DeliveryDocument> {
    const delivery = await this.deliveryRepo.findOne({ id });
    if (!delivery) {
      throw new NotFoundException('Delivery item not found');
    }
    return delivery;
  }

  async getAllDeliveries(
    filter: FilterQuery<DeliveryDocument>,
  ): Promise<DeliveryDocument[]> {
    return await this.deliveryRepo.find(filter);
  }

  async createDelivery(
    createDeliveryDto: CreateDeliveryDto,
  ): Promise<DeliveryDocument> {
    const deliveryCompany = await this.deliverCompaniesService.findById(
      createDeliveryDto.delivery_company,
    );
    const delivery = this.deliveryRepo.create({
      ...createDeliveryDto,
      deliveryCompany: deliveryCompany._id,
    });
    return delivery;
  }
}
