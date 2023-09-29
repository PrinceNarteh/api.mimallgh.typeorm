import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/userDto';
import { UserDocument } from './schema/user.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async find(filter: FilterQuery<UserDocument>): Promise<UserDocument[]> {
    const users = await this.userRepo.find(filter);
    return users;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(id);
    return user;
  }

  async findOneByEmailOrPhoneNumber(emailOrPhoneNumber: string) {
    const user = await this.userRepo.findOne({
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

  async createUser(user: CreateUserDto): Promise<UserDocument> {
    const createdUser = this.userRepo.create(user);
    return createdUser;
  }

  async updateUser(
    userId: string,
    user: Partial<CreateUserDto>,
  ): Promise<UserDocument> {
    const updatedUser = await this.userRepo.findOneAndUpdate(
      { id: userId },
      user,
    );
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<UserDocument> {
    const deletedUser = await this.userRepo.delete(userId);
    return deletedUser;
  }
}
