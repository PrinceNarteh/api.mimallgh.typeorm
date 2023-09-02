import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'deliveries' })
export class Delivery {
  @Prop({ required: true })
  request: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop()
  otherDetails: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  alternatePhoneNumber?: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  deliveryCharge: number;

  @Prop({ required: true })
  dateAndTime: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  deliveryCompany: 'DeliveryCompany';
}

export type DeliveryDocument = mongoose.HydratedDocument<Delivery>;
export const DeliverySchema = SchemaFactory.createForClass(Delivery);
