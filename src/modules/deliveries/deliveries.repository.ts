import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../common/abstract.repository';
import { Delivery, DeliveryDocument } from './schema/delivery.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeliveryRepository extends AbstractRepository<DeliveryDocument> {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
  ) {
    super(deliveryModel);
  }
}
