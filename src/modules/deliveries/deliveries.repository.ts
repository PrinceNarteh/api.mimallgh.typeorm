import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../common/abstract.repository';
import { DELIVERY_MODEL, DeliveryDocument } from './schema/delivery.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeliveryRepository extends AbstractRepository<DeliveryDocument> {
  constructor(
    @InjectModel(DELIVERY_MODEL) private deliveryModel: Model<DeliveryDocument>,
  ) {
    super(deliveryModel);
  }
}
