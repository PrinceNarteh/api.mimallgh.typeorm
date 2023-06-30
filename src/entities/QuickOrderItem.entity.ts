import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { QuickOrder } from './quickOrder.entity';
import { Shop } from './shop.entity';

@Entity('quick_order_items')
export class QuickOrderItem extends Base {
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
  @JoinColumn({ name: 'quick_order_id' })
  order: QuickOrder;
}
