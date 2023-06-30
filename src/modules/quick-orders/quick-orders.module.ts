import { Module } from '@nestjs/common';
import { QuickOrdersController } from './quick-orders.controller';
import { QuickOrdersService } from './quick-orders.service';
import { DeliveryCompaniesModule } from '../delivery-companies/delivery-companies.module';

@Module({
  imports: [DeliveryCompaniesModule],
  controllers: [QuickOrdersController],
  providers: [QuickOrdersService],
})
export class QuickOrdersModule {}
