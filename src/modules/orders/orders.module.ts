import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/users/user.module';
import { ProductModule } from '../products/product.module';
import { ShopModule } from '../shops/shop.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ORDER_ITEM_MODEL, OrderItemSchema } from './schema/order-item.schema';
import { ORDER_MODEL, OrderSchema } from './schema/order.schema';
import { OrderRepository } from './orders.repository';

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
  providers: [OrdersService, OrderRepository],
})
export class OrdersModule {}
