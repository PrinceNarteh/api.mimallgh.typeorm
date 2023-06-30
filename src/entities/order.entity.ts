import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { Base } from './base/baseEntity';
import { User } from './user.entity';
import { customAlphabet } from 'nanoid/async';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Entity('orders')
export class Order extends Base {
  @Column({
    name: 'order_id',
  })
  orderId: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
  })
  items: OrderItem[];

  @BeforeInsert()
  async calcAmount() {
    this.amount = this.items.reduce(
      (amt, currentItem) => amt + currentItem.price * currentItem.quantity,
      0,
    );

    this.orderId = await nanoid(10);
  }
}
