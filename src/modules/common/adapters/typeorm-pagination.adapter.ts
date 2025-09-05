import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Pagination } from '@modules/common/entities/pagination.entity';

export function typeormPaginationAdapter(meta: IPaginationMeta): Pagination {
  return new Pagination({
    page: meta.currentPage,
    itemsPerPage: meta.itemsPerPage,
    totalItems: meta.totalItems ?? 0,
    totalPages: meta.totalPages ?? 0,
  });
}
