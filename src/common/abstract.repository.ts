import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

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
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, {
      __v: 0,
      ...projection,
    });
  }

  async findById(
    entityId: string,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel.findById(entityId, {
      __v: 0,
      ...projection,
    });
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    entityUpdateData: UpdateQuery<unknown>,
  ): Promise<T> {
    return this.entityModel.findByIdAndUpdate(
      entityFilterQuery,
      entityUpdateData,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async delete(id: string): Promise<T> {
    return this.entityModel.findByIdAndDelete(id);
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
