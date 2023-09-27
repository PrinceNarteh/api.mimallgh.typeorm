import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from '../products/product.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { REVIEW_MODEL, ReviewSchema } from './schema/review.schema';
import { ReviewRepository } from './reviews.repository';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: REVIEW_MODEL,
        schema: ReviewSchema,
      },
    ]),
    ProductModule,
    UserModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
})
export class ReviewsModule {}
