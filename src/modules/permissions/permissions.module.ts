import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PERMISSION_MODEL,
  PermissionSchema,
} from './schema/permissions.schema';
import { PermissionRepository } from './permissions.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PERMISSION_MODEL,
        schema: PermissionSchema,
      },
    ]),
  ],
  providers: [PermissionsService, PermissionRepository],
  controllers: [PermissionsController],
})
export class PermissionsModule {}
