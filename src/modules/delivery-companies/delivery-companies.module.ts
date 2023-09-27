import { Module } from '@nestjs/common';
import { DeliveryCompaniesController } from './delivery-companies.controller';
import { DeliveryCompaniesService } from './delivery-companies.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DELIVERY_COMPANY_MODEL,
  DeliveryCompanySchema,
} from './schema/delivery-company.schema';
import { DeliveryCompanyRepository } from './delivery-companies.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DELIVERY_COMPANY_MODEL, schema: DeliveryCompanySchema },
    ]),
  ],
  controllers: [DeliveryCompaniesController],
  providers: [DeliveryCompaniesService, DeliveryCompanyRepository],
  exports: [DeliveryCompaniesService],
})
export class DeliveryCompaniesModule {}
