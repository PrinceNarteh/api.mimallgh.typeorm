import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { LoginDto } from 'src/common/login-dto';
import { ParseMongoIdPipe } from 'src/common/validate-id';
import { LoginResponseType } from 'src/custom-types';
import { SharpFileInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/admin.dto';
import { AdminResInterceptor } from './interceptors/admin-response.interceptor';
import { AdminDocument } from './schemas/admin.schema';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('login')
  async login(
    @Body() adminLoginDto: LoginDto,
  ): Promise<LoginResponseType<AdminDocument>> {
    return this.adminsService.login(adminLoginDto);
  }

  @Get()
  @UseInterceptors(AdminResInterceptor)
  async getAllAdmins(): Promise<AdminDocument[]> {
    return this.adminsService.getAllAdmins({});
  }

  @Get(':adminId')
  @UseInterceptors(AdminResInterceptor)
  async getAdminById(
    @Param('adminId', ParseMongoIdPipe) adminId: string,
  ): Promise<AdminDocument> {
    return this.adminsService.getAdmin(adminId);
  }

  @UseInterceptors(FileInterceptor('profile_image'), AdminResInterceptor)
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

  @UseInterceptors(FileInterceptor('profile_image'), AdminResInterceptor)
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

  @Delete(':adminId')
  async deleteAdmin(@Param('adminId', ParseMongoIdPipe) adminId: string) {
    console.log(adminId);
    return this.adminsService.deleteAdmin(adminId);
  }

  @Get('/image/:imageName')
  async getProductImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    res.sendFile(join(process.cwd(), 'uploads/admins/' + imageName));
  }
}
