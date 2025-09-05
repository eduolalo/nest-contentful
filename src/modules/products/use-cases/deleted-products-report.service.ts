import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { DeletedProductsPercentageDto } from '@modules/products/dto';

import { Product } from '@modules/products/entities';

@Injectable()
export class DeletedProductsReportService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async runReport(): Promise<DeletedProductsPercentageDto> {
    const percentageQuery = `
      (
        COUNT(
          CASE WHEN deleted_at IS NOT NULL THEN 1 END
        ) * 100.0
      ) / COUNT(*)
    `;
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select(percentageQuery, 'percentage')
      .withDeleted()
      .getRawOne<{ percentage: string }>();

    const percentage = result?.percentage ? Number(result.percentage) : 0;
    return {
      percentageNumber: percentage,
      percentageString: `${percentage.toFixed(2)}%`,
    };
  }
}
