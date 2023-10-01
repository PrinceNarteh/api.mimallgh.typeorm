import { Injectable, BadRequestException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateRoleDto } from './dto/roles.dto';
import { RoleRepository } from './roles.repository';
import { RoleDocument } from './schema/role.schema';
import { PermissionsService } from '../permissions/permissions.service';

const validatePermissions = ({
  allowedPermissions,
  userPermissions,
}: {
  allowedPermissions: string[];
  userPermissions: string[];
}) => {
  const invalidPermission = [];
  for (const permission of userPermissions) {
    if (allowedPermissions.includes(permission)) {
      continue;
    } else {
      invalidPermission.push(permission);
    }
  }

  if (invalidPermission.length > 0) {
    throw new BadRequestException(
      `Invalid permission${
        invalidPermission.length > 1 && 's'
      }: ${invalidPermission.join(', ')}`,
    );
  }
};

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepo: RoleRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getRoles(filter: FilterQuery<RoleDocument>): Promise<RoleDocument[]> {
    return this.roleRepo.find(filter);
  }
  async getRole(role: FilterQuery<RoleDocument>): Promise<RoleDocument> {
    return this.roleRepo.findOne(role);
  }

  async findRoleById(id: string): Promise<RoleDocument> {
    const role = await this.roleRepo.findById(id);
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleDocument> {
    const permissions = (await this.permissionsService.getPermissions({})).map(
      (permission) => String(permission.name),
    );

    validatePermissions({
      allowedPermissions: permissions,
      userPermissions: createRoleDto.permissions,
    });

    const role = await this.roleRepo.create(createRoleDto);
    return role;
  }

  async findRoleAndUpdate(
    roleId: string,
    data: Partial<CreateRoleDto>,
  ): Promise<RoleDocument> {
    return this.roleRepo.findByIdAndUpdate(roleId, data);
  }

  async deleteRole(id: string): Promise<RoleDocument> {
    return this.roleRepo.delete(id);
  }
}
