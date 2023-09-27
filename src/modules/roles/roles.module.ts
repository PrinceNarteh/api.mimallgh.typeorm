import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ROLE_MODEL, RoleSchema } from './schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ROLE_MODEL, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
