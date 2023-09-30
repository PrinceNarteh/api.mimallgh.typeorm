import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document, Types } from 'mongoose';
import { Order } from 'src/modules/orders/schema/order.schema';
import { Review } from 'src/modules/reviews/schema/review.schema';

export type UserRole = 'admin' | 'user';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop()
  middle_name: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop()
  alternate_number: string;

  @Prop()
  nationality: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profile_image: string;

  @Prop()
  cardType: string;

  @Prop()
  cardNumber: string;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop()
  role: string;

  @Prop()
  level: string;

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'Order',
    },
  ])
  orders: Order[];

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'Review',
    },
  ])
  reviews: Review[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
export const USER_MODEL = User.name;

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});
