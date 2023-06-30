import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuickOrder } from 'src/entities/quick-order.entity';
import { Repository } from 'typeorm';
import { CreateQuickOrderDto } from './dto/quickOrderDto';

@Injectable()
export class QuickOrdersService {
  constructor(
    @InjectRepository(QuickOrder)
    private quickOrderRepo: Repository<QuickOrder>,
  ) {}

  async getAllQuickOrders(param: { [key: string]: string }) {
    const builder = this.quickOrderRepo.createQueryBuilder('order');

    // pagination
    const page = parseInt(param.page, 10) || 1;
    const perPage = parseInt(param.perPage, 10) || 10;
    const total = await builder.getCount();

    builder.offset(perPage * (page - 1)).limit(perPage);

    return {
      data: await builder.getMany(),
      total,
      page,
      lastPage: Math.ceil(total / perPage),
    };
  }

  async getQuickOrder(orderId: string, relations?: boolean) {
    const order = await this.quickOrderRepo.findOne({
      where: { id: orderId },
      ...(relations && { relations: ['items'] }),
    });

    return order;
  }

  async createQuickOrder(order: CreateQuickOrderDto) {
    const quickOrder = this.quickOrderRepo.create(order);
    await this.quickOrderRepo.save(quickOrder);
    return quickOrder;
  }
}
