import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../common/abstract.repository';
import {
  PERMISSION_MODEL,
  PermissionDocument,
} from './schema/permissions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PermissionRepository extends AbstractRepository<PermissionDocument> {
  constructor(
    @InjectModel(PERMISSION_MODEL)
    private permissionModel: Model<PermissionDocument>,
  ) {
    super(permissionModel);
  }
}
