import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: [String],
    required: true,
  })
  permissions: Permissions[];
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
export const ROLE_MODEL = Role.name;
