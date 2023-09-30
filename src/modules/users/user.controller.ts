import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Query,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/userDto';
import { UserDocument } from './schema/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Query() query: { [key: string]: string }) {
    return this.userService.find(query);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Post('/register')
  @UseInterceptors(FileInterceptor('profile_image'))
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    return this.userService.createUser(createUserDto);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string) {
    return `Update user with ID ${userId}`;
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
