import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PERMISSION_MODEL,
  PermissionSchema,
} from './schema/permissions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PERMISSION_MODEL,
        schema: PermissionSchema,
      },
    ]),
  ],
  providers: [PermissionsService],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
