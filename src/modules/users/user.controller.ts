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
    return this.userService.getAllUsers(query);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @UseInterceptors(FileInterceptor('profile_image'))
  @Post('/register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    return this.userService.createUser(createUserDto);
  }

  @UseInterceptors(FileInterceptor('profile_image'))
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() data: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUser(userId, data);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
