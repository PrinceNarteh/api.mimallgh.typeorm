import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QuickOrderItem } from 'src/modules/quick-orders/schema/quick-order-item.schema';
import { Review } from 'src/modules/reviews/schema/review.schema';
import { Shop } from 'src/modules/shops/schema/shop.schema';

export enum CategoryType {
  'food',
  'fashion_and_wears',
  'grocery_and_general',
  'health_and_wellness',
  'home_and_electrical_appliances',
  'personal_services',
  'printing_and_stationery',
  'tech',
}

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  discountPercentage: number;

  @Prop({
    default: 0,
    required: true,
  })
  stock: number;

  @Prop({ required: true })
  brand: string;

  @Prop({
    type: 'enum',
    enum: CategoryType,
    required: true,
  })
  category: string;

  @Prop([Number])
  rating: number[];

  @Prop([String])
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  reviews: Review[];

  @Prop({ type: Types.ObjectId, ref: 'QuickOrderItem' })
  quickOrderItems: QuickOrderItem[];

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: Shop;
}

export const PRODUCT_MODEL = Product.name;
export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('find', function (next: Function) {
  this.populate({ path: 'shop', select: { name: 1, location: 1 } });
});

ProductSchema.pre('findOne', function (next: Function) {
  this.populate('shop');
});
