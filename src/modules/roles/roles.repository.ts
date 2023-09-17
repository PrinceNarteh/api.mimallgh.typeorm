import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/abstract.repository';
import { ROLE_MODEL, RoleDocument } from './schema/role.schema';

export class RoleRepository extends AbstractRepository<RoleDocument> {
  constructor(
    @InjectModel(ROLE_MODEL)
    private roleModel: Model<RoleDocument>,
  ) {
    super(roleModel);
  }
}
