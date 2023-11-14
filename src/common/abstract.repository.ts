import {
  Document,
  FilterQuery,
  Model,
  UpdateQuery,
  ProjectionType,
  QueryOptions,
} from 'mongoose';

export class AbstractRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery);
  }

  async paginate(params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const search = params.search || '';
  }

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, projection, options);
  }

  async findById(
    entityId: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.entityModel.findById(entityId, projection, options);
  }

  async create<A>(createEntityData: A): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findByIdAndUpdate(
    entityId: string,
    entityUpdateData: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T> {
    return this.entityModel.findByIdAndUpdate(entityId, entityUpdateData, {
      new: true,
      runValidators: true,
      ...options,
    });
  }

  async delete(id: string, options?: QueryOptions<T>): Promise<T> {
    return this.entityModel.findByIdAndDelete(id, options);
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
