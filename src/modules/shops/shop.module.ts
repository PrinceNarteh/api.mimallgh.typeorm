import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SHOP_MODEL, ShopSchema } from './schema/shop.schema';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SHOP_MODEL,
        schema: ShopSchema,
      },
    ]),
  ],
  controllers: [ShopController],
  exports: [ShopService],
  providers: [ShopService],
})
export class ShopModule {}
