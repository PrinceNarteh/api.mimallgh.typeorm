import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/entities/delivery.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/deliveryDto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
  ) {}

  async getDelivery(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findOne({
      where: { id },
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
    const deliveryCompany = await this.getDelivery(
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
