import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage, memoryStorage } from 'multer';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductModule } from './modules/products/product.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShopAuthModule } from './modules/shop-auth/shop-auth.module';
import { ShopModule } from './modules/shops/shop.module';
import { UserModule } from './modules/users/user.module';
import { DeliveryCompaniesModule } from './modules/delivery-companies/delivery-companies.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { QuickOrdersModule } from './modules/quick-orders/quick-orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    MulterModule.register({
      // storage: memoryStorage(),
      storage: diskStorage({
        destination: './files',
      }),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    ShopModule,
    ShopAuthModule,
    OrdersModule,
    ReviewsModule,
    DeliveryCompaniesModule,
    DeliveriesModule,
    QuickOrdersModule,
  ],
  providers: [],
})
export class AppModule {}
