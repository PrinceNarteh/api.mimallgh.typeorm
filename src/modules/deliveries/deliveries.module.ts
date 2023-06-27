import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/entities/delivery.entity';
import { DeliveryCompaniesModule } from '../delivery-companies/delivery-companies.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), DeliveryCompaniesModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
