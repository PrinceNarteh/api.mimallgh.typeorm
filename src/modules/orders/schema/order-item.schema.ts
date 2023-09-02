import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'order_items' })
export class OrderItem {
  @Prop({ required: true })
  quantity: number;

  @Prop('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new PropNumericTransformer(),
  })
  price: number;

  @ManyToOne(() => Product)
  @JoinProp({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Shop)
  @JoinProp({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinProp({ name: 'order_id' })
  order: Order;
}
