import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../common/abstract.repository';
import {
  DELIVERY_COMPANY_MODEL,
  DeliveryCompanyDocument,
} from './schema/delivery-company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DeliveryCompanyRepository extends AbstractRepository<DeliveryCompanyDocument> {
  constructor(
    @InjectModel(DELIVERY_COMPANY_MODEL)
    private deliveryCompanyModel: Model<DeliveryCompanyDocument>,
  ) {
    super(deliveryCompanyModel);
  }

  async findOneBySlug(slug: string): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyModel.findOne({ slug });
  }
}
