import { customAlphabet } from 'nanoid/async';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { Base } from './base/baseEntity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Entity('quick_orders')
export class QuickOrder extends Base {
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

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'alternate_phone_number', nullable: true })
  alternate_phoneNumber: string;

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
