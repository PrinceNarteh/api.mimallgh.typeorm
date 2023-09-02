import { Types, Document } from 'mongoose';
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

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'DeliveryCompany',
  })
  deliveryCompany: 'DeliveryCompany';
}

export type DeliveryDocument = Delivery & Document;
export const DeliverySchema = SchemaFactory.createForClass(Delivery);
export const DELIVERY_MODEL = Delivery.name;
