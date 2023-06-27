import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery])],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
})
export class DeliveriesModule {}
