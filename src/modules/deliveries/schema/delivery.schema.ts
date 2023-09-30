import { Types, Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { DeliveryCompany } from 'src/modules/delivery-companies/schema/delivery-company.schema';

@Schema({ collection: 'deliveries' })
export class Delivery {
  @Prop({ required: true })
  request: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop()
  other_details: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop()
  alternate_phone_number?: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  delivery_charge: number;

  @Prop({ required: true })
  date_and_time: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'DeliveryCompany',
  })
  delivery_company: DeliveryCompany;
}

export type DeliveryDocument = Delivery & Document;
export const DeliverySchema = SchemaFactory.createForClass(Delivery);
export const DELIVERY_MODEL = Delivery.name;
