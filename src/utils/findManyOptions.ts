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

  if (search) {
    findOptions.where = [
      { title: ILike(`%${search}%`) },
      { description: ILike(`%${search}%`) },
    ];
  }

  return {
    currentPage: page,
    findOptions,
  };
};
