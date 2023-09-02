import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export class AbstractRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery);
  }

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, {
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
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      entityUpdateData,
      {
        new: true,
      },
    );
  }

  async delete(entityFilterQuery: FilterQuery<T>): Promise<T> {
    return this.entityModel.findOneAndDelete(entityFilterQuery);
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
