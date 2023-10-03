import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryCompaniesService } from '../delivery-companies/delivery-companies.service';
import { ProductService } from '../products/product.service';
import { ShopService } from '../shops/shops.service';
import { CreateQuickOrderDto } from './dto/quickOrderDto';
import { QuickOrderItemRepository } from './quick-order-item.repository';
import { QuickOrderRepository } from './quick-orders.repository';
import { QuickOrderDocument } from './schema/quick-order.schema';

@Injectable()
export class QuickOrdersService {
  constructor(
    private quickOrderRepo: QuickOrderRepository,
    private quickOrderItemRepo: QuickOrderItemRepository,
    private deliveryCompaniesService: DeliveryCompaniesService,
    private shopService: ShopService,
    private productService: ProductService,
  ) {}

  async getAllQuickOrders(param: { [key: string]: string }) {
    return await this.quickOrderRepo.find({});
  }

  async getQuickOrder(
    orderId: string,
    relations?: boolean,
  ): Promise<QuickOrderDocument | null> {
    const order = await this.quickOrderRepo.findOne({ id: orderId });
    return order;
  }

  async createQuickOrder(
    order: CreateQuickOrderDto,
  ): Promise<QuickOrderDocument> {
    const deliveryCompany =
      await this.deliveryCompaniesService.getDeliveryCompany(
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

    await this.quickOrderRepo.create(quickOrder);

    for (const item of items) {
      const shop = await this.shopService.getShop(item.shopId);
      const product = await this.productService.getProduct(item.productId);
      const res = this.quickOrderItemRepo.create({
        ...item,
        shop,
        product,
        order: quickOrder,
      });
    }

    return quickOrder;
  }
}
