import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseMongoIdPipe } from 'src/common/validate-id';
import { SharpFileInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/admin.dto';
import { AdminDocument } from './schemas/admin.schema';

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

  @UseInterceptors(FileInterceptor('profile_image'))
  @Post('register')
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFile(new SharpFileInterceptorPipe('admins'))
    profile_image?: string,
  ) {
    return this.adminsService.createAdmin({
      ...createAdminDto,
      profile_image,
    });
  }

  @UseInterceptors(FileInterceptor('profile_image'))
  @Patch(':adminId')
  async updateAdmin(
    @Param('adminId', ParseMongoIdPipe) adminId: string,
    @Body() updateAdminDto: Partial<CreateAdminDto>,
    @UploadedFile(new SharpFileInterceptorPipe('admins'))
    profile_image?: string,
  ) {
    return this.adminsService.updateAdmin(
      adminId,
      updateAdminDto,
      profile_image,
    );
  }
}
