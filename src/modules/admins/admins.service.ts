import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FilterQuery } from 'mongoose';
import { generateToken } from 'src/common/generate-token';
import { LoginDto } from 'src/common/login-dto';
import { LoginResponseType } from 'src/custom-types';
import { deleteFile } from 'src/utils/deleteFile';
import { RolesService } from '../roles/roles.service';
import { AdminRepository } from './admins.repository';
import { CreateAdminDto } from './dto/admin.dto';
import { AdminDocument } from './schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/schema/role.schema';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    adminLoginDto: LoginDto,
  ): Promise<LoginResponseType<AdminDocument>> {
    const admin = await this.adminRepo.findOne(
      { email: adminLoginDto.email },
      '+password',
    );

    if (
      !admin ||
      !(await bcrypt.compare(adminLoginDto.password, admin.password))
    ) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = generateToken(
      { id: admin._id, role: (admin.role as Role).name },
      this.jwtService,
    );

    return {
      token,
      data: admin,
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

    return (await this.adminRepo.create(createAdminDto)).populate('role');
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

    const save_profile = profile_image
      ? profile_image
      : admin.profile_image
      ? admin.profile_image.split('/')[
          admin.profile_image.split('/').length - 1
        ]
      : undefined;

    return await this.adminRepo.findByIdAndUpdate(adminId, {
      ...updateAdminDto,
      profile_image: save_profile,
    });
  }

  async deleteAdmin(adminId: string): Promise<string> {
    const admin = await this.getAdmin(adminId);

    if (!admin) {
      return 'Admin deleted successfully';
    }
    deleteFile(admin.profile_image, 'admins');
    await this.adminRepo.delete(adminId);
    return 'Admin deleted successfully';
  }
}
