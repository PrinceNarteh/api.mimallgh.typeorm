import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/users/users.module';
import { ProductModule } from '../products/product.module';
import { ShopModule } from '../shops/shops.module';
import { OrderItemRepository } from './order-item.repository';
import { OrdersController } from './orders.controller';
import { OrderRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { ORDER_ITEM_MODEL, OrderItemSchema } from './schema/order-item.schema';
import { ORDER_MODEL, OrderSchema } from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ORDER_MODEL, schema: OrderSchema },
      { name: ORDER_ITEM_MODEL, schema: OrderItemSchema },
    ]),
    UserModule,
    ProductModule,
    ShopModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, OrderItemRepository],
})
export class OrdersModule {}
