import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';

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
    return this.userService.find({});
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.findById(userId);
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
