import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/userDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async user(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }

  async findOneByEmailOrPhoneNumber(emailOrPhoneNumber: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: emailOrPhoneNumber },
          { phoneNumber: emailOrPhoneNumber },
        ],
      },
    });

    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    return await this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        image: true,
        ...include,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    const emailOrPhoneNumberExist = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
      },
    });

    if (emailOrPhoneNumberExist) {
      throw new BadRequestException('Email or Phone number already in used.');
    }

    const { image, password } = data;

    const hashPassword = await bcrypt.hash(password, 12);

    console.log(hashPassword);

    if (image) {
      const user = await this.prismaService.user.create({
        data: {
          ...data,
          password: hashPassword,
          image: {
            create: {
              ...data.image,
            },
          },
        },
      });
      const { password, ...result } = user;
      return result;
    } else {
      const user = await this.prismaService.user.create({
        data: {
          ...data,
          password: hashPassword,
        },
      });
      const { password, ...result } = user;
      return result;
    }
  }

  async updateUser(userId: string, data: any) {
    let user = await this.user(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
        image: {
          delete: true,
          create: {
            ...data.image,
          },
        },
      },
    });

    return user;
  }

  async deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
