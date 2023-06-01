import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Delivery } from './delivery.entity';
import { Shop } from './shop.entity';
import { Product } from './product.entity';

@Entity('delivery_items')
export class Item extends Base {
  @Column()
  quantity: number;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Delivery, (delivery) => delivery.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'delivery_id' })
  order: Delivery;
}
