import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { USER_MODEL, UserDocument } from './schema/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(
    @InjectModel(USER_MODEL)
    private userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
