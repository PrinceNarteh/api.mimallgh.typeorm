import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';

@Entity()
export class OrderItem extends Base {
  @Column({
    name: 'product_id',
  })
  productId: string;

  @Column({
    name: 'product_name',
  })
  productName: string;

  @Column()
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column({
    name: 'shop_name',
  })
  shopName: string;

  @Column({
    name: 'shop_id',
  })
  shopId: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
