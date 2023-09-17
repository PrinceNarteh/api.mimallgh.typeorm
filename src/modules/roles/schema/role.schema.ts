import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role {
  @Prop()
  name: string;

  @Prop({
    type: [String],
  })
  permissions: string[];
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
export const ROLE_MODEL = Role.name;
