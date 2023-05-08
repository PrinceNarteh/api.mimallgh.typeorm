import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';

@Entity()
export class OrderItem extends Base {
  @Column()
  productId: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column()
  shopName: string;

  @Column()
  shopId: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
