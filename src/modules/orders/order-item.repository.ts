import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import {} from './schema/order.schema';
import {
  ORDER_ITEM_MODEL,
  OrderItemDocument,
} from './schema/order-item.schema';

@Injectable()
export class OrderItemRepository extends AbstractRepository<OrderItemDocument> {
  constructor(
    @InjectModel(ORDER_ITEM_MODEL)
    private deliveryModel: Model<OrderItemDocument>,
  ) {
    super(deliveryModel);
  }
}
