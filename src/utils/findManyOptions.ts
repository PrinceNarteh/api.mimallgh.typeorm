import { FindManyOptions, ILike } from 'typeorm';

export const createFindOptions = ({
  page,
  perPage,
  order,
  search,
}: {
  page?: number;
  perPage?: number;
  order?: 'asc' | 'desc';
  search?: string;
}) => {
  page = page || 1;
  perPage = perPage || 10;
  order = order || 'asc';

  const findOptions: FindManyOptions = {
    take: perPage,
    skip: (page - 1) * perPage,
    order: {
      id: order,
    },
  };

  return {
    currentPage: Number(page),
    perPage: Number(perPage),
    findOptions,
  };
};
