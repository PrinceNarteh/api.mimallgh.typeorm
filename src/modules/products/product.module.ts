import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import { ShopModule } from 'src/modules/shops/shop.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [ShopModule, TypeOrmModule.forFeature([Product, ProductImage])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
