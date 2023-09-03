import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/abstract.repository';
import {
  QUICK_ORDER_ITEM_MODEL,
  QuickOrderItemDocument,
} from './schema/quick-order-item.schema';

@Injectable()
export class QuickOrderItemRepository extends AbstractRepository<QuickOrderItemDocument> {
  constructor(
    @InjectModel(QUICK_ORDER_ITEM_MODEL)
    private deliveryModel: Model<QuickOrderItemDocument>,
  ) {
    super(deliveryModel);
  }
}
