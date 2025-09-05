import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductsPercentageDto, ProductsPercentageResponseDto } from '@modules/products/dto';

import { Product } from '@modules/products/entities';

@Injectable()
export class ProductsReportService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async runReport({
    price,
    fromDate,
    toDate,
  }: ProductsPercentageDto): Promise<ProductsPercentageResponseDto> {
    const percentageQuery = `
      (
        COUNT(CASE WHEN deleted_at IS NULL THEN 1 END) * 100.0
      ) / NULLIF(COUNT(*), 0)
    `;

    const query = this.productsRepository
      .createQueryBuilder('product')
      .select(percentageQuery, 'percentage')
      .withDeleted();

    if (price) {
      query.andWhere('price = :price', { price });
    }
    if (fromDate) {
      query.andWhere('created_at >= :fromDate', { fromDate });
    }
    if (toDate) {
      query.andWhere('created_at <= :toDate', { toDate });
    }

    const result = await query.getRawOne<{ percentage: string }>();

    const percentage = result?.percentage ? Number(result.percentage) : 0;
    return {
      percentageNumber: percentage,
      percentageString: `${percentage.toFixed(2)}%`,
    };
  }
}
