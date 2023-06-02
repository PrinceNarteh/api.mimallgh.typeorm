import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/entities/delivery.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/deliveryDto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
  ) {}

  async getDelivery(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({
      where: { id },
      select: {
        items: {
          product: {
            title: true,
          },
        },
      },
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
