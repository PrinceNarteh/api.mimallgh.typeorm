import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from './schema/user.schema';
import { UserRepository } from './users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: USER_MODEL,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
