import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/users/user.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/OrderItem.entity';
import { ProductModule } from '../products/product.module';
import { ShopModule } from '../shops/shop.module';

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
