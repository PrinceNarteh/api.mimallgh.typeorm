import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Delivery } from 'src/modules/deliveries/schema/delivery.schema';

Schema({ collection: 'delivery_companies' });
export class DeliveryCompany {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop({ name: 'phone_number' })
  phoneNumber: string;

  @Prop({ nullable: true, name: 'alternate_phone_number' })
  alternatePhoneNumber: string;

  @Prop({ name: 'whatsapp_number' })
  whatsappNumber: string;

  @Prop({ nullable: true })
  location: string;

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'Delivery',
    },
  ])
  deliveries: Delivery[];

  @Prop([{ type: Types.ObjectId, ref: 'QuickOrder' }])
  quickOrders: 'QuickOrder[]';

  @Prop([String])
  images: string[];

  //   @BeforeInsert()
  //   @BeforeUpdate()
  //   async beforeInsert(): Promise<void> {
  //     // slugify title
  //     this.slug = slugify(this.name, { remove: /[*+~.()'"!:@]/g, lower: true });
  //   }
}

export type DeliveryCompanyDocument = DeliveryCompany & Document;
export const DeliveryCompanySchema =
  SchemaFactory.createForClass(DeliveryCompany);
export const DELIVERY_COMPANY_MODEL = DeliveryCompany.name;
