import { Model, Document, FilterQuery } from "mongoose";
export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async find(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, null>
  ): Promise<T[]> {
    return await this.entityModel.find(entityFilterQuery, { ...projection });
  }
  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, null>
  ): Promise<T | null> {
    return await this.entityModel.findOne(entityFilterQuery, { ...projection });
  }
  async create(entityData: unknown): Promise<T> {
    const entityInstance = new this.entityModel(entityData);

    return entityInstance.save();
  }
  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    entityData: unknown
  ): Promise<T> {
    return await this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      entityData,
      {
        new: true,
      }
    );
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount > 0;
  }
}
