import { Injectable, NotFoundException } from '@nestjs/common';
import { Delivery } from 'src/entities/delivery.entity';
import { DeliveryRepository } from './deliveries.repository';
import { CreateDeliveryDto } from './dto/deliveryDto';
import { DeliveryDocument } from './schema/delivery.schema';

@Injectable()
export class DeliveriesService {
  constructor(private readonly deliveryRepo: DeliveryRepository) {}

  async getDelivery(id: string): Promise<DeliveryDocument> {
    const delivery = await this.deliveryRepo.findOne({ _id: id });

    if (!delivery) {
      throw new NotFoundException('Delivery item not found');
    }

    return delivery;
  }

  async getAllDeliveries(): Promise<DeliveryDocument[]> {
    return await this.deliveryRepo.find({});
  }

  async createDelivery(
    createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    const deliveryCompany = await this.deliveryCompanyService.findOne(
      createDeliveryDto.deliveryCompany,
    );
    const delivery = this.deliveryRepo.create({
      ...createDeliveryDto,
      deliveryCompany,
    });
    await this.deliveryRepo.save(delivery);
    return delivery;
  }
}
