import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { typeormPaginationAdapter } from '@common/adapters';

import { ListProductsDto } from '@modules/products/dto/list-products.dto';
import { Product, ProductsPage } from '@modules/products/entities';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async exec({ page, itemsPerPage, ...filters }: ListProductsDto): Promise<ProductsPage> {
    const options: IPaginationOptions = {
      page,
      limit: itemsPerPage,
    };
    const query = this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.name', 'ASC');

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      const isNumber = typeof value === 'number';
      const operator = isNumber ? '=' : 'ILIKE';
      const val = isNumber ? value : `%${value}%`;

      query.andWhere(`product.${key} ${operator} :${key}`, { [key]: val });
    });

    const { items, meta } = await paginate<Product>(query, options);

    return new ProductsPage({ items, pagination: typeormPaginationAdapter(meta) });
  }
}
