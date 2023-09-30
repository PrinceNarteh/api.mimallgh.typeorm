import { IsMongoId } from 'class-validator';

export class MongoID {
  @IsMongoId({ message: 'Not  a validated MongoDB ID' })
  id: string;
}
