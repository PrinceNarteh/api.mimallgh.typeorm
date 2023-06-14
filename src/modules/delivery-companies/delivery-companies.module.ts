import { Module } from '@nestjs/common';
import { DeliveryCompaniesController } from './delivery-companies.controller';
import { DeliveryCompaniesService } from './delivery-companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryCompany } from 'src/entities/deliveryCompany.entity';
import { DeliveryCompanyImage } from 'src/entities/deliveryCompanyImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryCompany, DeliveryCompanyImage])],
  controllers: [DeliveryCompaniesController],
  providers: [DeliveryCompaniesService],
})
export class DeliveryCompaniesModule {}
