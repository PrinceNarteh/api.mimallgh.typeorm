import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { generateToken } from 'src/common/generate-token';
import { LoginResponseType } from 'src/custom-types';
import { deleteFile } from 'src/utils/deleteFile';
import { RolesService } from '../roles/roles.service';
import { AdminRepository } from './admins.repository';
import { AdminLoginDto, CreateAdminDto } from './dto/admin.dto';
import { AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    adminLoginDto: AdminLoginDto,
  ): Promise<LoginResponseType<AdminDocument>> {
    const user = await this.adminRepo.findOne({ email: adminLoginDto.email });

    if (!user || !bcrypt.compare(user.password, adminLoginDto.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = generateToken(
      { id: user._id, role: user.role.toString() },
      this.jwtService,
    );

    return {
      token,
      data: user,
    };
  }

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
      createAdminDto.profile_image &&
        deleteFile(createAdminDto.profile_image, 'admins');
      throw new ConflictException('admin already exists');
    }

    const role = await this.rolesService.getRoleById(createAdminDto.role);
    if (!role) {
      createAdminDto.profile_image &&
        deleteFile(createAdminDto.profile_image, 'admins');
      throw new BadRequestException('role not found');
    }

    return this.adminRepo.create(createAdminDto);
  }

  async updateAdmin(
    adminId: string,
    updateAdminDto: Partial<CreateAdminDto>,
    profile_image: string,
  ): Promise<AdminDocument> {
    const admin = await this.getAdmin(adminId);
    if (!admin && profile_image) {
      deleteFile(profile_image, 'admins');
    }

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    if (admin.profile_image && profile_image) {
      deleteFile(admin.profile_image, 'admins');
    }

    return await this.adminRepo.findByIdAndUpdate(adminId, {
      ...updateAdminDto,
      ...(profile_image && { profile_image }),
    });
  }

  async deleteAdmin(adminId: string): Promise<AdminDocument> {
    return await this.adminRepo.delete(adminId);
  }
}
