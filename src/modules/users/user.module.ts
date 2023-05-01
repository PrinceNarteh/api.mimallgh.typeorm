import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserImage } from 'src/entities/userImage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserImage])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}