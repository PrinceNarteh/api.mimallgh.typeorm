import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid/async';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { Base } from './base/baseEntity';
import { Product } from './product.entity';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Entity('shops')
export class Shop extends Base {
  @Column({
    unique: true,
  })
  shopCode: string;

  @Column()
  password: string;

  @Column()
  plainPassword: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column()
  mapDirection: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  alternateNumber: string;

  @Column({ nullable: true })
  whatsappNumber: string;

  @Column({ nullable: true })
  instagramHandle: string;

  @Column({ nullable: true })
  facebookHandle: string;

  @Column()
  openingTime: string;

  @Column()
  closingTime: string;

  @Column({ nullable: true })
  image?: string | null;

  @Column({ nullable: true })
  banner?: string | null;

  @OneToMany(() => Product, (product) => product.shop, {
    onDelete: 'CASCADE',
  })
  products: Product[];

  @OneToMany(() => OrderItem, (product) => product.shop, {
    onDelete: 'CASCADE',
  })
  orders: OrderItem[];

  @BeforeInsert()
  async hashPassword() {
    const genPassword = await nanoid(10);
    this.password = await bcrypt.hash(genPassword, 12);
    this.plainPassword = genPassword;
  }
}
