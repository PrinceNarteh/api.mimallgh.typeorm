import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { AdminRepository } from './admins.repository';
import { CreateAdminDto } from './dto/admin.dto';
import { AdminDocument } from './schemas/admin.schema';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly rolesService: RolesService,
  ) {}

  async getAllAdmins(
    filter: FilterQuery<AdminDocument>,
  ): Promise<AdminDocument[]> {
    return await this.adminRepo.find(filter);
  }

  async getAdmin(id: string): Promise<AdminDocument> {
    return await this.adminRepo.findById(id);
  }

  async getAdminByEmailOrPhoneNumber(emailOrPhoneNumber: string) {
    const admin = await this.adminRepo.findOne({
      where: [
        { email: emailOrPhoneNumber },
        { phoneNumber: emailOrPhoneNumber },
      ],
    });

    if (!admin) {
      throw new NotFoundException('admin not found');
    }
    return admin;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
    const adminExists = await this.adminRepo.findOne({
      email: createAdminDto.email,
    });

    if (adminExists) {
      throw new ConflictException('admin already exists');
    }

    const role = await this.rolesService.getRoleById(createAdminDto.role);
    if (!role) {
      throw new BadRequestException('role not found');
    }

    return this.adminRepo.create(createAdminDto);
  }

  async updateAdmin(
    adminId: string,
    admin: Partial<CreateAdminDto>,
  ): Promise<AdminDocument> {
    return await this.adminRepo.findByIdAndUpdate(adminId, admin);
  }

  async deleteAdmin(adminId: string): Promise<AdminDocument> {
    return await this.adminRepo.delete(adminId);
  }
}
