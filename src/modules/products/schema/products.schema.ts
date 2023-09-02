import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  reviews: 'Review[]';

  @Prop([String])
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'QuickOrderItem' })
  quickOrderItems: ' QuickOrderItem[]';

  @Prop({ type: Types.ObjectId, ref: 'Shop' })
  shop: 'Shop';
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
export const PRODUCT_MODEL = Product.name;
