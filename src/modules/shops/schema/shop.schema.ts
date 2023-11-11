import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { customAlphabet } from 'nanoid/async';
import * as bcrypt from 'bcrypt';

import { OrderItem } from 'src/modules/orders/schema/order-item.schema';
import { Product } from 'src/modules/products/schema/product.schema';
import { QuickOrderItem } from 'src/modules/quick-orders/schema/quick-order-item.schema';
import { ROLE_MODEL, Role } from 'src/modules/roles/schema/role.schema';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Schema()
export class Shop {
  @Prop({
    unique: true,
    required: true,
  })
  shopCode: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  plainPassword: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  mapDirection: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  alternateNumber: string;

  @Prop()
  whatsappNumber: string;

  @Prop()
  instagramHandle: string;

  @Prop()
  facebookHandle: string;

  @Prop()
  twitterHandle: string;

  @Prop()
  tiktokHandle: string;

  @Prop({ required: true })
  openingTime: string;

  @Prop({ required: true })
  closingTime: string;

  @Prop()
  image: string;

  @Prop()
  banner: string;

  @Prop({
    type: Types.ObjectId,
    ref: ROLE_MODEL,
    required: true,
  })
  role: Role;

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'Product',
    },
  ])
  products: Product[];

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'OrderItem',
    },
  ])
  orders: OrderItem[];

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'QuickOrderItem',
    },
  ])
  quickOrderItems: QuickOrderItem[];
}

export type ShopDocument = Shop & Document;
export const ShopSchema = SchemaFactory.createForClass(Shop);
export const SHOP_MODEL = Shop.name;

ShopSchema.pre('save', async function (next) {
  if (this.get('password')) {
    const genPassword = await nanoid(10);
    this.password = await bcrypt.hash(genPassword, 12);
    this.plainPassword = genPassword;
  }

  if (this.get('facebookHandle')) {
    this.facebookHandle =
      'https://wwww.facebook.com/' + this.facebookHandle.trim();
  }

  if (this.get('instagramHandle')) {
    this.instagramHandle =
      'https://www.instagram.com/' + this.instagramHandle.trim();
  }

  if (this.get('whatsappNumber')) {
    this.whatsappNumber = 'https://wa.me/' + this.whatsappNumber.trim();
  }

  if (this.get('twitterHandle')) {
    this.twitterHandle = 'https://twitter.com/' + this.twitterHandle.trim();
  }

  if (this.get('tiktokHandle')) {
    this.tiktokHandle = 'https://www.tiktok.com/' + this.tiktokHandle.trim();
  }

  next();
});

ShopSchema.pre('findOneAndUpdate', async function (next) {
  if (this.get('facebookHandle')) {
    this.set(
      'facebookHandle',
      `https://wwww.facebook.com/${this.get('facebookHandle').trim()}`,
    );
  }

  if (this.get('instagramHandle')) {
    this.set(
      'instagramHandle',
      `https://www.instagram.com/${this.get('instagramHandle').trim()}`,
    );
  }

  if (this.get('whatsappNumber')) {
    this.set(
      'whatsappNumber',
      `https://wa.me/${this.get('whatsappNumber').trim()}`,
    );
  }

  if (this.get('twitterHandle')) {
    this.set(
      'twitterHandle',
      `https://twitter.com/${this.get('twitterHandle').trim()}`,
    );
  }

  if (this.get('tiktokHandle')) {
    this.set(
      'tiktokHandle',
      `https://www.tiktok.com/${this.get('tiktokHandle').trim()}`,
    );
  }

  next();
});

ShopSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    return ret;
  },
});
