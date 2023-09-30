import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { CreateUserDto } from './dto/userDto';
import { UserDocument } from './schema/user.schema';
import { UserRepository } from './users.repository';

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
    const userExists = await this.userRepo.findOne({ email: user.email });

    if (userExists) {
      throw new ConflictException('User already exists');
    }
    return this.userRepo.create(user);
  }

  async updateUser(
    userId: string,
    user: Partial<CreateUserDto>,
  ): Promise<UserDocument> {
    const updatedUser = await this.userRepo.findByIdAndUpdate(userId, user);
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<UserDocument> {
    const deletedUser = await this.userRepo.delete(userId);
    return deletedUser;
  }
}
