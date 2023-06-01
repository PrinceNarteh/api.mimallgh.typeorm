import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base/baseEntity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Item } from './deliveryItem.entity';

@Entity('delivery')
export class Delivery extends Base {
  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  alternatePhoneNumber: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  deliveryCharge: number;

  @OneToMany(() => Item, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: Item[];

  @BeforeInsert()
  async calcAmount() {
    this.amount = this.items.reduce(
      (amt, currentItem) =>
        amt + currentItem.product.price * currentItem.quantity,
      0,
    );
  }
}
