import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { validate } from './config/env.validation';
import { AdminsModule } from './modules/admins/admins.module';
import { AuthModule } from './modules/auth/auth.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';
import { DeliveryCompaniesModule } from './modules/delivery-companies/delivery-companies.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ProductModule } from './modules/products/product.module';
import { QuickOrdersModule } from './modules/quick-orders/quick-orders.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RolesModule } from './modules/roles/roles.module';
import { ShopModule } from './modules/shops/shops.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './files',
      }),
    }),
    AdminsModule,
    AuthModule,
    ProductModule,
    ShopModule,
    OrdersModule,
    ReviewsModule,
    DeliveryCompaniesModule,
    DeliveriesModule,
    QuickOrdersModule,
    RolesModule,
    PermissionsModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
