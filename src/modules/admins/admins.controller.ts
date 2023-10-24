import { Controller, Get, Param } from '@nestjs/common';
import { AdminDocument } from './schemas/admin.schema';
import { AdminsService } from './admins.service';
import { ParseMongoIdPipe } from 'src/common/validate-id';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}
  @Get()
  async getAllAdmins(): Promise<AdminDocument[]> {
    return this.adminsService.getAllAdmins({});
  }

  @Get(':adminId')
  async getAdminById(
    @Param(':adminId', ParseMongoIdPipe) adminId: string,
  ): Promise<AdminDocument> {
    return this.adminsService.getAdmin(adminId);
  }
}
