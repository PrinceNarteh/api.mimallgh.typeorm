import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { REVIEW_MODEL, ReviewDocument } from './schema/review.schema';

@Injectable()
export class ReviewRepository extends AbstractRepository<ReviewDocument> {
  constructor(
    @InjectModel(REVIEW_MODEL)
    private reviewModel: Model<ReviewDocument>,
  ) {
    super(reviewModel);
  }
}
