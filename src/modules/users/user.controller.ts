import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ) {
    return this.userService.findAll({
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      order: {
        updatedAt: orderBy,
      },
    });
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
