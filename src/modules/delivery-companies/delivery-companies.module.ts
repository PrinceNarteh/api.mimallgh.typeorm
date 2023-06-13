import { Module } from '@nestjs/common';
import { DeliveryCompaniesController } from './delivery-companies.controller';
import { DeliveryCompaniesService } from './delivery-companies.service';

@Module({
  controllers: [DeliveryCompaniesController],
  providers: [DeliveryCompaniesService]
})
export class DeliveryCompaniesModule {}
