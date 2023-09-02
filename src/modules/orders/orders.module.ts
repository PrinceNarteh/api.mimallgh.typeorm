import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/users/user.module';
import { ProductModule } from '../products/product.module';
import { ShopModule } from '../shops/shop.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ORDER_MODEL, OrderSchema } from './schema/orders.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ORDER_MODEL, schema: OrderSchema }]),
    UserModule,
    ProductModule,
    ShopModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
