import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { UserModule } from '../users/user.module';
import { ProductModule } from '../products/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UserModule, ProductModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
