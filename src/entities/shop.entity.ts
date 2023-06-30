import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid/async';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './OrderItem.entity';
import { Base } from './base/baseEntity';
import { Product } from './product.entity';
import { QuickOrderItem } from './QuickOrderItem.entity';

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

  @Column({ nullable: true })
  twitterHandle: string;

  @Column({ nullable: true })
  tiktokHandle: string;

  @Column()
  openingTime: string;

  @Column()
  closingTime: string;

  @Column({ type: String, nullable: true })
  image?: string | null;

  @Column({ type: String, nullable: true })
  banner?: string | null;

  @OneToMany(() => Product, (product) => product.shop, {
    onDelete: 'CASCADE',
  })
  products: Product[];

  @OneToMany(() => OrderItem, (product) => product.shop, {
    onDelete: 'CASCADE',
  })
  orders: OrderItem[];

  @OneToMany(
    () => QuickOrderItem,
    (quickOrderItem) => quickOrderItem.product,
    {
      cascade: true,
    },
  )
  quickOrderItems: QuickOrderItem[];

  @BeforeInsert()
  async beforeInsert() {
    const genPassword = await nanoid(10);
    this.password = await bcrypt.hash(genPassword, 12);
    this.plainPassword = genPassword;

    if (this.facebookHandle) {
      this.facebookHandle =
        'https://wwww.facebook.com/' + this.facebookHandle.trim();
    }

    if (this.instagramHandle) {
      this.instagramHandle =
        'https://www.instagram.com/' + this.instagramHandle.trim();
    }

    if (this.whatsappNumber) {
      this.whatsappNumber = 'https://wa.me/' + this.whatsappNumber.trim();
    }

    if (this.twitterHandle) {
      this.twitterHandle = 'https://twitter.com/' + this.twitterHandle.trim();
    }

    if (this.tiktokHandle) {
      this.tiktokHandle = 'https://www.tiktok.com/' + this.tiktokHandle.trim();
    }
  }

  @BeforeUpdate()
  async beforeUpdate() {
    if (this.facebookHandle) {
      this.facebookHandle =
        'https://wwww.facebook.com/' + this.facebookHandle.trim();
    }

    if (this.instagramHandle) {
      this.instagramHandle =
        'https://www.instagram.com/' + this.instagramHandle.trim();
    }

    if (this.whatsappNumber) {
      this.whatsappNumber = 'https://wa.me/' + this.whatsappNumber.trim();
    }

    if (this.twitterHandle) {
      this.twitterHandle = 'https://twitter.com/' + this.twitterHandle.trim();
    }

    if (this.tiktokHandle) {
      this.tiktokHandle = 'https://www.tiktok.com/' + this.tiktokHandle.trim();
    }
  }
}
