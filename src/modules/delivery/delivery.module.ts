import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/entities/delivery.entity';
import { Item } from 'src/entities/deliveryItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Item])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
