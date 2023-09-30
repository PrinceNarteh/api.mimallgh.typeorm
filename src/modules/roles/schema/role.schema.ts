import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Role {
  @Prop()
  name: string;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: 'Permission',
      },
    ],
  })
  permissions: Permissions[];
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
export const ROLE_MODEL = Role.name;
