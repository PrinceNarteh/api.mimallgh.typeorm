import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Permission {
  @Prop()
  name: string;
}

export const PERMISSION_MODEL = Permission.name;
export type PermissionDocument = Permission & Document;
export const PermissionSchema = SchemaFactory.createForClass(Permission);
