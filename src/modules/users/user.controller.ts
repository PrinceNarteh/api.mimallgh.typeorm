import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { FindManyOptions, ILike } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    page = page || 1;
    perPage = perPage || 10;
    order = order || 'asc';

    const findOptions: FindManyOptions<User> = {
      where: {
        role,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      order: {
        id: order,
      },
    };

    if (search) {
      findOptions.where = [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
        { phoneNumber: ILike(`%${search}%`) },
      ];
    }

    const options = { findOptions, currentPage: page, perPage };

    return this.userService.getUsers(options);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.user(userId);
  }

  @Put(':userId')
  async updateUser(@Param('userId') userId: string) {
    return `Update user with ID ${userId}`;
  }

  @Put(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
