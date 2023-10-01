import {
  BadRequestException,
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
import { ParseMongoIdPipe } from 'src/common/validate-id';

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
  async getRole(
    @Param('roleId', ParseMongoIdPipe) roleId: string,
  ): Promise<RoleDocument> {
    return this.roleService.findRoleById(roleId);
  }

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    try {
      return this.roleService.createRole(createRoleDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/:roleId')
  async updateRole(
    @Param('roleId', ParseMongoIdPipe) roleId: string,
    @Body() updateRoleDto: Partial<CreateRoleDto>,
  ) {
    return this.roleService.findRoleAndUpdate(roleId, updateRoleDto);
  }

  @Delete('/:roleId')
  async deleteRole(roleId: string): Promise<RoleDocument> {
    return this.roleService.deleteRole(roleId);
  }
}
