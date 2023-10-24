import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { ADMIN_MODEL, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminRepository extends AbstractRepository<AdminDocument> {
  constructor(
    @InjectModel(ADMIN_MODEL)
    private adminModel: Model<AdminDocument>,
  ) {
    super(adminModel);
  }
}
