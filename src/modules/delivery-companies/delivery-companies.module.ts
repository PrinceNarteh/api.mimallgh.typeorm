import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryCompany } from 'src/entities/deliveryCompany.entity';
import { DeliveryCompanyImage } from 'src/entities/deliveryCompanyImage.entity';
import { DeliveryCompaniesController } from './delivery-companies.controller';
import { DeliveryCompaniesService } from './delivery-companies.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryCompany, DeliveryCompanyImage])],
  controllers: [DeliveryCompaniesController],
  providers: [DeliveryCompaniesService],
  exports: [DeliveryCompaniesService],
})
export class DeliveryCompaniesModule {}
