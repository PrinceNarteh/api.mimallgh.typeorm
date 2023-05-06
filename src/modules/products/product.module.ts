import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import { ShopModule } from 'src/modules/shops/shop.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Shop } from 'src/entities/shop.entity';

@Module({
  imports: [
    ShopModule,
    TypeOrmModule.forFeature([Product, ProductImage, Shop]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
