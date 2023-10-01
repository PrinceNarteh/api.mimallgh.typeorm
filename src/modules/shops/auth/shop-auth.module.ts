import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ShopModule } from 'src/modules/shops/shop.module';
import { ShopAuthController } from './shop-auth.controller';
import { ShopAuthService } from './shop-auth.service';
import { ShopJwtStrategy } from './strategies/jwt-strategy';
import { ShopLocalStrategy } from './strategies/local-strategy';
import { ShopRefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: `6UNZ7rWXy9gjBo965rWKxpy9xAo7D08kBuV7kGwuFiw=`,
      signOptions: { expiresIn: '15m' },
    }),
    ShopModule,
  ],
  providers: [
    ShopAuthService,
    ShopLocalStrategy,
    ShopJwtStrategy,
    ShopRefreshJwtStrategy,
  ],
  controllers: [ShopAuthController],
})
export class ShopAuthModule {}
