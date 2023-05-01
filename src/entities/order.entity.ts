import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { Base } from './base/baseEntity';
import { User } from './user.entity';
import { customAlphabet } from 'nanoid/async';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Entity()
export class Order extends Base {
  @Column()
  orderId: string;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.orders)
  userId: User;

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
