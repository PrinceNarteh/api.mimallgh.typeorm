import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from 'src/modules/products/schema/product.schema';
import { Shop } from 'src/modules/shops/schema/shop.schema';
import { Order } from './order.schema';

@Schema({ collection: 'order_items' })
export class OrderItem {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: Product;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Shop' })
  shop: Shop;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Order' })
  order: Order;
}

export type OrderItemDocument = OrderItem & Document;
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export const ORDER_ITEM_MODEL = OrderItem.name;
