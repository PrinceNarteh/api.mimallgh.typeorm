import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdminDocument } from './schemas/admin.schema';
import { AdminsService } from './admins.service';
import { ParseMongoIdPipe } from 'src/common/validate-id';
import { CreateAdminDto } from './dto/admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpFileInterceptorPipe } from 'src/shared/pipes/sharp.pipe';

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
    @UploadedFile(new SharpFileInterceptorPipe('profile_image'))
    profile_image?: string,
  ) {
    return this.adminsService.createAdmin({
      ...createAdminDto,
      profile_image,
    });
  }
}
