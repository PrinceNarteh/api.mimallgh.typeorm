import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Delivery } from './delivery.entity';
import { Shop } from './shop.entity';

@Entity('delivery_items')
export class Item extends Base {
  @Column()
  quantity: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Delivery, (delivery) => delivery.items, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'delivery_id' })
  order: Delivery;
}
