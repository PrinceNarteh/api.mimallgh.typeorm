import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Admin {
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
  card_type: string;

  @Prop()
  card_number: string;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop()
  role: string;
}

export const ADMIN_MODEL = Admin.name;
export const AdminSchema = SchemaFactory.createForClass(Admin);
export type AdminDocument = Admin & Document;

AdminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

AdminSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    delete ret['__v'];
    return ret;
  },
});
