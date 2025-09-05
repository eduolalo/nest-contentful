import { Type } from '@nestjs/common';

export interface IPage<TData> {
  items: TData[];
  pagination: Pagination;
}

export class Pagination {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;

  constructor(attributes: Pagination) {
    Object.assign(this, attributes);
  }
}

export function PaginatedResult<TItemType>(): Type<IPage<TItemType>> {
  abstract class Page<TItems = TItemType> implements IPage<TItems> {
    items: TItems[];

    pagination: Pagination;
  }

  return Page as Type<IPage<TItemType>>;
}
