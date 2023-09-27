import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../common/abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  QUICK_ORDER_MODEL,
  QuickOrderDocument,
} from './schema/quick-order.schema';

@Injectable()
export class QuickOrderRepository extends AbstractRepository<QuickOrderDocument> {
  constructor(
    @InjectModel(QUICK_ORDER_MODEL)
    private deliveryModel: Model<QuickOrderDocument>,
  ) {
    super(deliveryModel);
  }
}
