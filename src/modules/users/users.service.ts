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
import { CreateUserDto } from './dto/userDto';
import { UserDocument } from './schema/user.schema';
import { UserRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../roles/schema/role.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseType<any>> {
    const user = await this.userRepo.findOne(
      {
        email: loginDto.email,
      },
      '+password',
    );

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = generateToken(
      { id: user._id, role: (user.role as Role).name },
      this.jwtService,
    );

    return user.set({ token });
  }

  async getAllUsers(
    filter: FilterQuery<UserDocument>,
  ): Promise<UserDocument[]> {
    const users = await this.userRepo.find(filter);
    return users;
  }

  async getUser(id: string): Promise<UserDocument> {
    const user = await this.userRepo.findById(id);
    return user;
  }

  async getUserByEmailOrPhoneNumber(emailOrPhoneNumber: string) {
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

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    const userExists = await this.userRepo.findOne({
      email: createUserDto.email,
    });

    if (userExists) {
      createUserDto.profile_image &&
        deleteFile(createUserDto.profile_image, 'users');
      throw new ConflictException('User already exists');
    }

    return this.userRepo.create(createUserDto);
  }

  async updateUser(
    userId: string,
    updateUserDto: Partial<CreateUserDto>,
    profile_image?: string,
  ): Promise<UserDocument> {
    const user = await this.getUser(userId);
    if (!user && profile_image) {
      deleteFile(profile_image, 'users');
    }

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return await this.userRepo.findByIdAndUpdate(userId, {
      ...updateUserDto,
      ...(profile_image && { profile_image }),
    });
  }

  async deleteUser(userId: string): Promise<UserDocument> {
    const deletedUser = await this.userRepo.delete(userId);
    return deletedUser;
  }
}
