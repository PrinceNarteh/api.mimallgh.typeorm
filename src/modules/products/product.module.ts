import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ShopModule } from 'src/modules/shops/shop.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ShopModule, PrismaModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
