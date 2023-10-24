import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { AdminRepository } from './admins.repository';
import { CreateAdminDto } from './dto/admin.dto';
import { AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsService {
  constructor(private readonly adminRepo: AdminRepository) {}

  async getAllAdmins(
    filter: FilterQuery<AdminDocument>,
  ): Promise<AdminDocument[]> {
    const users = await this.adminRepo.find(filter);
    return users;
  }

  async getAdmin(id: string): Promise<AdminDocument> {
    const user = await this.adminRepo.findById(id);
    return user;
  }

  async getUserByEmailOrPhoneNumber(emailOrPhoneNumber: string) {
    const user = await this.adminRepo.findOne({
      where: [
        { email: emailOrPhoneNumber },
        { phoneNumber: emailOrPhoneNumber },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(user: CreateAdminDto): Promise<AdminDocument> {
    const userExists = await this.adminRepo.findOne({ email: user.email });

    if (userExists) {
      throw new ConflictException('User already exists');
    }
    return this.adminRepo.create(user);
  }

  async updateUser(
    userId: string,
    user: Partial<CreateAdminDto>,
  ): Promise<AdminDocument> {
    const updatedUser = await this.adminRepo.findByIdAndUpdate(userId, user);
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<AdminDocument> {
    const deletedUser = await this.adminRepo.delete(userId);
    return deletedUser;
  }
}
