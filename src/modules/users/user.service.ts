import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserImage } from 'src/entities/userImage.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/userDto';
import {
  FindManyReturnType,
  IFindManyOptions,
} from 'src/types/findManyOptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserImage)
    private readonly userImgRepo: Repository<UserImage>,
  ) {}

  async user(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
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

  async getUsers(
    params: IFindManyOptions<User>,
  ): Promise<FindManyReturnType<User>> {
    const {
      currentPage,
      perPage,
      findOptions: { order, skip, where },
    } = params;

    const [users, total] = await this.userRepo.findAndCount({
      skip,
      take: perPage,
      where,
      order,
    });

    return {
      total,
      perPage,
      page: currentPage,
      data: users,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const emailOrPhoneNumberExist = await this.userRepo.findOne({
      where: [
        { email: createUserDto.email },
        { phoneNumber: createUserDto.phoneNumber },
      ],
    });

    if (emailOrPhoneNumberExist) {
      throw new BadRequestException('Email or Phone number already in used.');
    }

    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);
    const { password, ...result } = user;
    return result;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    let userExists = await this.user(userId);

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    const user = await this.userRepo.update(userId, {
      ...updateUserDto,
    });

    return user;
  }

  async deleteUser(id: string) {
    return this.userRepo.delete(id);
  }
}
