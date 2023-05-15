import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity()
export class OrderItem extends Base {
  @Column()
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Product)
  shop: Shop;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
