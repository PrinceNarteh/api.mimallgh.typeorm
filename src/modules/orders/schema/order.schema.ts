import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order {
  @Prop({ name: 'order_id', required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: 'User';

  @Prop([{ type: Types.ObjectId, ref: 'OrderItem', required: true }])
  items: 'OrderItem[]';

  //   @BeforeInsert()
  //   async calcAmount() {
  //     this.amount = this.items.reduce(
  //       (amt, currentItem) => amt + currentItem.price * currentItem.quantity,
  //       0,
  //     );

  //     this.orderId = await nanoid(10);
  //   }
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
export const ORDER_MODEL = Order.name;
