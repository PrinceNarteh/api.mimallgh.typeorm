import { Document, Types } from 'mongoose';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Order } from 'src/modules/orders/schema/order.schema';
import { Review } from 'src/modules/reviews/schema/review.schema';

export type UserRole = 'admin' | 'user';

export type UserLevel =
  | 'level_one'
  | 'level_two'
  | 'level_three'
  | 'super_user';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  middleName: string;

  @Prop()
  address: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  alternateNumber: string;

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
  image: string;

  @Prop()
  cardType: string;

  @Prop()
  cardNumber: string;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @Prop({
    type: 'enum',
    enum: ['level_one', 'level_two', 'level_three', 'super_user'],
    nullable: true,
    default: 'level_one',
  })
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

  //   @BeforeInsert()
  //   async hashPassword() {
  //     this.password = await bcrypt.hash(this.password, 12);
  //   }
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
export const USER_MODEL = User.name;
