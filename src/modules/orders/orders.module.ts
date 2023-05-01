import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/users/user.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
