import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { AdminRepository } from './admins.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ADMIN_MODEL, AdminSchema } from './schemas/admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ADMIN_MODEL,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService, AdminRepository],
})
export class AdminsModule {}
