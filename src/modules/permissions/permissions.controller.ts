import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionDocument } from './schema/permissions.schema';
import { CreatePermissionDto } from './dto/permissions.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async getPermissions(
    @Param() param: { [key: string]: string },
  ): Promise<PermissionDocument[]> {
    return this.permissionsService.getPermissions(param);
  }

  @Get('/:permissionId')
  async getPermission(
    @Param('permissionId') permissionId: string,
  ): Promise<PermissionDocument> {
    return this.permissionsService.getPermissionById(permissionId);
  }

  @Post('/:permissionId')
  async getPermissionByName(
    @Body('name') name: string,
  ): Promise<PermissionDocument> {
    return this.permissionsService.getPermissionByName(name);
  }

  @Post()
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Patch('/:permissionId')
  async updatePermission(
    @Param('permissionId') permissionId: string,
    @Body() updatePermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return this.permissionsService.updatePermission(
      permissionId,
      updatePermissionDto,
    );
  }

  @Delete('/:permissionId')
  async deletePermission(
    @Param('permissionId') permissionId: string,
  ): Promise<PermissionDocument> {
    return this.permissionsService.deletePermission(permissionId);
  }
}
