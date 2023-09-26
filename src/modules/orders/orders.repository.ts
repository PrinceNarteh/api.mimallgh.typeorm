import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/abstract.repository';
import { ORDER_MODEL, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  constructor(
    @InjectModel(ORDER_MODEL)
    private deliveryModel: Model<OrderDocument>,
  ) {
    super(deliveryModel);
  }
}
