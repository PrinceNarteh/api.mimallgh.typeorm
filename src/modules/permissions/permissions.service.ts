import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permissions.repository';
import { FilterQuery } from 'mongoose';
import { PermissionDocument } from './schema/permissions.schema';
import { CreatePermissionDto } from './dto/permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepo: PermissionRepository) {}

  async getPermissions(
    filter: FilterQuery<PermissionDocument>,
  ): Promise<PermissionDocument[]> {
    return this.permissionsRepo.find(filter);
  }

  async getPermissionById(id: string): Promise<PermissionDocument> {
    return this.permissionsRepo.findOne({ id });
  }

  async getPermissionByName(name: string): Promise<PermissionDocument> {
    return this.permissionsRepo.findOne({ name: name });
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const createdPermission = await this.permissionsRepo.create(
      createPermissionDto,
    );
    return createdPermission;
  }

  async updatePermission(
    permissionId: string,
    updatePermissionDto: CreatePermissionDto,
  ): Promise<PermissionDocument> {
    const createdPermission = await this.permissionsRepo.findByIdAndUpdate(
      permissionId,
      updatePermissionDto,
    );
    return createdPermission;
  }

  async deletePermission(id: string): Promise<PermissionDocument> {
    return this.permissionsRepo.delete(id);
  }
}
