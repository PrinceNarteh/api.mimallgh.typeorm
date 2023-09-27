import { Module } from '@nestjs/common';
import { ShopModule } from 'src/modules/shops/shop.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PRODUCT_MODEL, ProductSchema } from './schema/product.schema';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PRODUCT_MODEL, schema: ProductSchema }]),
    ShopModule,
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
