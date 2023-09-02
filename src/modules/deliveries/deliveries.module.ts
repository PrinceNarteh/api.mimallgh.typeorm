import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryCompaniesModule } from '../delivery-companies/delivery-companies.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { DELIVERY_MODEL, DeliverySchema } from './schema/deliveries.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DELIVERY_MODEL, schema: DeliverySchema },
    ]),
    DeliveryCompaniesModule,
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
