import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/deliveryDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from 'src/entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
  ) {}

  async getDelivery(deliveryId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery item not found');
    }

    return delivery;
  }

  async getAllDeliveries(): Promise<Delivery[]> {
    return await this.deliveryRepo.find();
  }

  async createDelivery(
    createDeliveryDto: CreateDeliveryDto,
  ): Promise<Delivery> {
    const delivery = this.deliveryRepo.create(createDeliveryDto);
    await this.deliveryRepo.save(delivery);
    return delivery;
  }
}
