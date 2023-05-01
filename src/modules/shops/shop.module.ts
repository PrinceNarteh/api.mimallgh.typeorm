import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from 'src/entities/shop.entity';
import { ShopImage } from 'src/entities/shopImage.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, ShopImage])],
  controllers: [ShopController],
  exports: [ShopService],
  providers: [ShopService],
})
export class ShopModule {}
