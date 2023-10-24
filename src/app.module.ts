import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { DeliveryCompaniesModule } from './modules/delivery-companies/delivery-companies.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductModule } from './modules/products/product.module';
import { QuickOrdersModule } from './modules/quick-orders/quick-orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShopModule } from './modules/shops/shops.module';
import { UserModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminsModule } from './modules/admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot('mongodb://localhost/mimall'),
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
    OrdersModule,
    ReviewsModule,
    DeliveryCompaniesModule,
    DeliveriesModule,
    QuickOrdersModule,
    RolesModule,
    PermissionsModule,
    AdminsModule,
  ],
  providers: [],
})
export class AppModule {}
