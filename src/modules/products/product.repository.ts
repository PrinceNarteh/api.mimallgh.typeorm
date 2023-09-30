import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { PRODUCT_MODEL, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(PRODUCT_MODEL) private productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }
}
