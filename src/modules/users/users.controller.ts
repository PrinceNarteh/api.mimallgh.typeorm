import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpFileInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
import { CreateUserDto } from './dto/userDto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './users.service';
import { LoginDto } from 'src/common/login-dto';
import { LoginResponseType } from 'src/custom-types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(loginDto: LoginDto): Promise<LoginResponseType<UserDocument>> {
    return this.userService.login(loginDto);
  }

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
    @UploadedFile(new SharpFileInterceptorPipe('profile_image'))
    profile_image?: string,
  ): Promise<UserDocument> {
    return this.userService.createUser({
      ...createUserDto,
      profile_image,
    });
  }

  @UseInterceptors(FileInterceptor('profile_image'))
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
    @UploadedFile(new SharpFileInterceptorPipe('profile_image'))
    profile_image?: string,
  ) {
    return this.userService.updateUser(userId, updateUserDto, profile_image);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
