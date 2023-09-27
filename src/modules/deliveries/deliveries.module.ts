import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryCompaniesModule } from '../delivery-companies/delivery-companies.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { DELIVERY_MODEL, DeliverySchema } from './schema/delivery.schema';
import { DeliveryRepository } from './deliveries.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DELIVERY_MODEL, schema: DeliverySchema },
    ]),
    DeliveryCompaniesModule,
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, DeliveryRepository],
})
export class DeliveriesModule {}
