import { Document, Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { customAlphabet } from 'nanoid';
import { QuickOrderItem } from './quick-order-item.schema';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Schema({ collection: 'quick_orders' })
export class QuickOrder {
  @Prop({
    name: 'order_id',
    required: true,
  })
  order_id: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'DeliveryCompany',
    name: 'delivery_company',
    required: true,
  })
  delivery_company: 'DeliveryCompany';

  @Prop({ required: true, name: 'delivery_charge' })
  delivery_charge: number;

  @Prop({ name: 'full_name', required: true })
  full_name: string;

  @Prop({ name: 'phone_number', required: true })
  phone_number: string;

  @Prop({ name: 'alternate_phone_number' })
  alternate_phone_number: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'QuickOrderItem',
    name: 'quick_order_item',
    required: true,
  })
  items: QuickOrderItem[];

  //   @BeforeInsert()
  //   async beforeInsert() {
  //     this.orderId = await nanoid(10);
  //   }
}

export type QuickOrderDocument = QuickOrder & Document;
export const QuickOrderSchema = SchemaFactory.createForClass(QuickOrder);
export const QUICK_ORDER_MODEL = QuickOrder.name;
