import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/abstract.repository';
import { SHOP_MODEL, ShopDocument } from './schema/shop.schema';

@Injectable()
export class ShopRepository extends AbstractRepository<ShopDocument> {
  constructor(
    @InjectModel(SHOP_MODEL)
    private ShopModel: Model<ShopDocument>,
  ) {
    super(ShopModel);
  }
}
