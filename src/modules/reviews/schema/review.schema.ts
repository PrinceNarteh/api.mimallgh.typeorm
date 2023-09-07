import { Document, Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Product } from 'src/modules/products/schema/product.schema';
import { User } from 'src/modules/users/schema/user.schema';

@Schema()
export class Review {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Product',
  })
  product: Product;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  user: User;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
export const REVIEW_MODEL = Review.name;
