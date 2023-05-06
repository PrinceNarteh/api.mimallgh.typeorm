import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends Base {
  @Column()
  productId: string;

  @Column()
  productName: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  shopName: string;

  @Column()
  shopId: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
