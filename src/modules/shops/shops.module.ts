import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopAuthController } from './auth/shop-auth.controller';
import { ShopAuthService } from './auth/shop-auth.service';
import { ShopJwtStrategy } from './auth/strategies/jwt-strategy';
import { ShopLocalStrategy } from './auth/strategies/local-strategy';
import { ShopRefreshJwtStrategy } from './auth/strategies/refreshToken.strategy';
import { SHOP_MODEL, ShopSchema } from './schema/shop.schema';
import { ShopController } from './shops.controller';
import { ShopService } from './shops.service';
import { ShopRepository } from './shops.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SHOP_MODEL,
        schema: ShopSchema,
      },
    ]),
    JwtModule.register({
      secret: `6UNZ7rWXy9gjBo965rWKxpy9xAo7D08kBuV7kGwuFiw=`,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [ShopController, ShopAuthController],
  providers: [
    ShopService,
    ShopRepository,
    ShopAuthService,
    ShopLocalStrategy,
    ShopJwtStrategy,
    ShopRefreshJwtStrategy,
  ],
  exports: [ShopService],
})
export class ShopModule {}
