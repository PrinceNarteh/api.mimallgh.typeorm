import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/OrderItem.entity';
import { Order } from 'src/entities/order.entity';
import { ShopModule } from 'src/modules/shops/shop.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [ShopModule, TypeOrmModule.forFeature([Order, OrderItem])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
