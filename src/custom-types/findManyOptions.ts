import { FindManyOptions } from 'typeorm';
import { uniqBy } from 'lodash';

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

export const returnValue = <T>({
  total,
  currentPage,
  perPage,
  data,
}: {
  total: number;
  currentPage: number;
  perPage: number;
  data: T[];
}): FindManyReturnType<T> => {
  const sortedData = uniqBy(data, 'id');

  return {
    total,
    page: Number(currentPage),
    perPage: Number(perPage),
    totalPages: Math.ceil(total / perPage),
    data: sortedData,
  };
};
