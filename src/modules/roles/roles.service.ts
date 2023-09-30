import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateRoleDto } from './dto/roles.dto';
import { RoleRepository } from './roles.repository';
import { RoleDocument } from './schema/role.schema';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepo: RoleRepository) {}

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
    const role = await this.roleRepo.create(createRoleDto);
    return role;
  }

  async findRoleAndUpdate(
    roleId: string,
    data: Partial<RoleDocument>,
  ): Promise<CreateRoleDto> {
    return this.roleRepo.findByIdAndUpdate(roleId, data);
  }

  async deleteRole(id: string): Promise<RoleDocument> {
    return this.roleRepo.delete(id);
  }
}
