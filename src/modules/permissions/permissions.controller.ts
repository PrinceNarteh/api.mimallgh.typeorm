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
import { ParseMongoIdPipe } from 'src/common/validate-id';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async getPermissions(
    @Param() param: { [key: string]: string },
  ): Promise<PermissionDocument[]> {
    return this.permissionsService.getAllPermissions(param);
  }

  @Get('/:permissionId')
  async getPermission(
    @Param('permissionId', ParseMongoIdPipe) id: string,
  ): Promise<PermissionDocument> {
    return this.permissionsService.getPermission(id);
  }

  @Post('/:permissionId')
  async getPermissionByName(
    @Body('name') name: string,
  ): Promise<PermissionDocument> {
    return this.permissionsService.getPermissionByName(name);
  }

  @Post()
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Patch('/:permissionId')
  async updatePermission(
    @Param('permissionId', ParseMongoIdPipe) permissionId: string,
    @Body() updatePermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    return this.permissionsService.updatePermission(
      permissionId,
      updatePermissionDto,
    );
  }

  @Delete('/:permissionId')
  async deletePermission(
    @Param('permissionId', ParseMongoIdPipe) permissionId: string,
  ): Promise<PermissionDocument> {
    return this.permissionsService.deletePermission(permissionId);
  }
}
