import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryCompaniesModule } from '../delivery-companies/delivery-companies.module';
import { ProductModule } from '../products/product.module';
import { ShopModule } from '../shops/shop.module';
import { QuickOrdersController } from './quick-orders.controller';
import { QuickOrdersService } from './quick-orders.service';
import {
  QUICK_ORDER_ITEM_MODEL,
  QuickOrderItemSchema,
} from './schema/quick-order-item.schema';
import {
  QUICK_ORDER_MODEL,
  QuickOrderSchema,
} from './schema/quick-order.schema';
import { QuickOrderRepository } from './quick-orders.repository';
import { QuickOrderItemRepository } from './quick-order-item.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QUICK_ORDER_MODEL,
        schema: QuickOrderSchema,
      },
      {
        name: QUICK_ORDER_ITEM_MODEL,
        schema: QuickOrderItemSchema,
      },
    ]),
    DeliveryCompaniesModule,
    ShopModule,
    ProductModule,
  ],
  controllers: [QuickOrdersController],
  providers: [
    QuickOrdersService,
    QuickOrderRepository,
    QuickOrderItemRepository,
  ],
})
export class QuickOrdersModule {}
