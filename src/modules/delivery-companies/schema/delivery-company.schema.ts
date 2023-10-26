import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Delivery } from 'src/modules/deliveries/schema/delivery.schema';
import { QuickOrder } from 'src/modules/quick-orders/schema/quick-order.schema';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';
import { ROLE } from 'src/constants';

@Schema({ collection: 'delivery_companies' })
export class DeliveryCompany {
  @Prop({ required: true })
  name: string;

  @Prop()
  slug: string;

  @Prop({ unique: true, lowercase: true, required: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ name: 'phone_number', required: true })
  phoneNumber: string;

  @Prop({ name: 'alternate_phone_number' })
  alternatePhoneNumber: string;

  @Prop({ name: 'whatsapp_number', required: true })
  whatsappNumber: string;

  @Prop({ required: true })
  location: string;

  @Prop({ name: 'owner_first_name', required: true })
  ownerFirstName: string;

  @Prop({ name: 'owner_last_name', required: true })
  ownerLastName: string;

  @Prop({ name: 'owner_phone_name', required: true })
  ownerPhoneNumber: string;

  @Prop([
    {
      type: Types.ObjectId,
      ref: 'Delivery',
    },
  ])
  deliveries: Delivery[];

  @Prop([{ type: Types.ObjectId, ref: 'QuickOrder' }])
  quickOrders: QuickOrder[];

  @Prop({
    type: String,
    enum: Object.keys(ROLE),
    immutable: true,
    required: true,
  })
  role: ROLE;

  @Prop([String])
  slide_images: string[];
}

export type DeliveryCompanyDocument = DeliveryCompany & Document;
export const DeliveryCompanySchema =
  SchemaFactory.createForClass(DeliveryCompany);
export const DELIVERY_COMPANY_MODEL = DeliveryCompany.name;

DeliveryCompanySchema.pre('save', async function (next: Function) {
  // hash password
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }

  // slugify title
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { remove: /[*+~.()'"!:@]/g, lower: true });
  }

  next();
});

DeliveryCompanySchema.pre<DeliveryCompanyDocument>(
  'findOneAndUpdate',
  async function (next: Function) {
    const name = this.get('name');
    if (name) {
      this.set(
        'slug',
        slugify(name, { remove: /[*+~.()'"!:@]/g, lower: true }),
      );
    }
    next();
  },
);

DeliveryCompanySchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    return ret;
  },
});
