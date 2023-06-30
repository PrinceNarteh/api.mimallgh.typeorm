import { Module } from '@nestjs/common';
import { QuickOrdersController } from './quick-orders.controller';
import { QuickOrdersService } from './quick-orders.service';
import { DeliveryCompaniesModule } from '../delivery-companies/delivery-companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickOrder } from 'src/entities/quickOrder.entity';
import { QuickOrderItem } from 'src/entities/QuickOrderItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuickOrder, QuickOrderItem]),
    DeliveryCompaniesModule,
  ],
  controllers: [QuickOrdersController],
  providers: [QuickOrdersService],
})
export class QuickOrdersModule {}
