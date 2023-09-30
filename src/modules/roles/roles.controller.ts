import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/roles.dto';
import { RolesService } from './roles.service';
import { RoleDocument } from './schema/role.schema';
import { MongoID } from 'src/common/validate-id';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  async getRoles(
    @Param() param: { [key: string]: string },
  ): Promise<RoleDocument[]> {
    return this.roleService.getRoles(param);
  }

  @Get('/:roleId')
  async getRole(@Param() { id }: MongoID): Promise<RoleDocument> {
    return this.roleService.findRoleById(id);
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Patch('/:roleId')
  async updateRole(
    @Param('roleId') { id }: MongoID,
    @Body() updateRoleDto: Partial<CreateRoleDto>,
  ) {
    return this.roleService.findRoleAndUpdate(id, updateRoleDto);
  }

  @Delete('/:roleId')
  async deleteRole(roleId: string): Promise<RoleDocument> {
    return this.roleService.deleteRole(roleId);
  }
}
