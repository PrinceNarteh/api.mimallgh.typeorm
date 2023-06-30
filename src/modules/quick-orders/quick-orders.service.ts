import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuickOrder } from 'src/entities/quickOrder.entity';
import { Repository } from 'typeorm';
import { DeliveryCompaniesService } from '../delivery-companies/delivery-companies.service';
import { CreateQuickOrderDto } from './dto/quickOrderDto';
import { QuickOrderItem } from 'src/entities/QuickOrderItem.entity';
import { ShopService } from '../shops/shop.service';
import { ProductService } from '../products/product.service';

@Injectable()
export class QuickOrdersService {
  constructor(
    @InjectRepository(QuickOrder)
    private quickOrderRepo: Repository<QuickOrder>,
    @InjectRepository(QuickOrderItem)
    private quickOrderItemRepo: Repository<QuickOrderItem>,
    private deliveryCompaniesService: DeliveryCompaniesService,
    private shopService: ShopService,
    private productService: ProductService,
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
    const deliveryCompany = await this.deliveryCompaniesService.findOne(
      order.deliveryCompany,
    );
    if (!deliveryCompany) {
      throw new NotFoundException('Delivery company not found');
    }

    const { items, ...result } = order;

    const quickOrder = this.quickOrderRepo.create({
      ...result,
      deliveryCompany,
      amount: items.reduce(
        (amt, currentItem) => amt + currentItem.price * currentItem.quantity,
        0,
      ),
    });

    await this.quickOrderRepo.save(quickOrder);

    for (const item of items) {
      const shop = await this.shopService.shop(item.shopId);
      const product = await this.productService.product(item.productId);
      const res = this.quickOrderItemRepo.create({
        ...item,
        shop,
        product,
        order: quickOrder,
      });

      await res.save();
    }

    return quickOrder;
  }
}
