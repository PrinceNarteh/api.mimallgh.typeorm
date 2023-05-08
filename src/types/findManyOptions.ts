import { FindManyOptions } from 'typeorm';

export interface FindManyReturnType<T> {
  total: number;
  page: Number;
  perPage: number;
  totalPages: number;
  data: T[];
}

export interface IFindManyOptions<T> {
  currentPage: number;
  perPage: number;
  findOptions: FindManyOptions<T>;
}
