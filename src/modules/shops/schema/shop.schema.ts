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
  shop_code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  plain_password: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  map_direction: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop()
  alternate_phone_number: string;

  @Prop()
  whatsapp_number: string;

  @Prop()
  instagram_handle: string;

  @Prop()
  facebook_handle: string;

  @Prop()
  twitter_handle: string;

  @Prop()
  tiktok_handle: string;

  @Prop({ required: true })
  opening_time: string;

  @Prop({ required: true })
  closing_time: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop()
  profile_image: string;

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
  quick_order_items: QuickOrderItem[];
}

export type ShopDocument = Shop & Document;
export const ShopSchema = SchemaFactory.createForClass(Shop);
export const SHOP_MODEL = Shop.name;

ShopSchema.pre('save', async function (next) {
  if (this.get('password')) {
    const genPassword = await nanoid(10);
    this.password = await bcrypt.hash(genPassword, 12);
    this.plain_password = genPassword;
  }

  if (this.get('facebook_handle')) {
    this.facebook_handle =
      'https://wwww.facebook.com/' + this.facebook_handle.trim();
  }

  if (this.get('instagram_handle')) {
    this.instagram_handle =
      'https://www.instagram.com/' + this.instagram_handle.trim();
  }

  if (this.get('whatsapp_number')) {
    this.whatsapp_number = 'https://wa.me/' + this.whatsapp_number.trim();
  }

  if (this.get('twitter_handle')) {
    this.twitter_handle = 'https://twitter.com/' + this.twitter_handle.trim();
  }

  if (this.get('tiktok_handle')) {
    this.tiktok_handle = 'https://www.tiktok.com/' + this.tiktok_handle.trim();
  }

  next();
});

ShopSchema.pre('findOneAndUpdate', async function (next) {
  if (this.get('facebook_handle')) {
    this.set(
      'facebook_handle',
      `https://wwww.facebook.com/${this.get('facebook_handle').trim()}`,
    );
  }

  if (this.get('instagram_handle')) {
    this.set(
      'instagram_handle',
      `https://www.instagram.com/${this.get('instagram_handle').trim()}`,
    );
  }

  if (this.get('whatsapp_number')) {
    this.set(
      'whatsapp_number',
      `https://wa.me/${this.get('whatsapp_number').trim()}`,
    );
  }

  if (this.get('twitter_handle')) {
    this.set(
      'twitter_handle',
      `https://twitter.com/${this.get('twitter_handle').trim()}`,
    );
  }

  if (this.get('tiktok_handle')) {
    this.set(
      'tiktok_handle',
      `https://www.tiktok.com/${this.get('tiktok_handle').trim()}`,
    );
  }

  next();
});
