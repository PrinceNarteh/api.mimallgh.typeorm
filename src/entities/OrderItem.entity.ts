import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Product } from './product.entity';
import { Shop } from './shop.entity';

@Entity('order_items')
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
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
