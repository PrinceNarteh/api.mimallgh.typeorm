import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/modules/products/schema/product.schema';
import { Shop } from 'src/modules/shops/schema/shop.schema';
import { QuickOrder } from './quick-order.schema';

@Schema({ collection: 'quick_order_items' })
export class QuickOrderItem {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Product;

  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true })
  shop: Shop;

  @Prop({ type: Types.ObjectId, ref: 'QuickOrder', required: true })
  order: QuickOrder;
}

export type QuickOrderItemDocument = QuickOrderItem & Document;
export const QuickOrderItemSchema =
  SchemaFactory.createForClass(QuickOrderItem);
export const QUICK_ORDER_ITEM_MODEL = QuickOrderItem.name;
