import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/OrderItem.entity';
import { Order } from 'src/entities/order.entity';
import { UserModule } from 'src/modules/users/user.module';
import { ProductModule } from '../products/product.module';
import { ShopModule } from '../shops/shop.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    UserModule,
    ProductModule,
    ShopModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
