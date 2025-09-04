import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { IProductRepository } from '@modules/products/interfaces';
import { Product } from '@modules/products/entities';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findId(externalId: string): Promise<string | null> {
    const product = await this.repository.findOne({
      select: ['id'],
      where: { externalId },
    });
    return product?.id ?? null;
  }

  async create(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  async update(id: string, product: Product): Promise<Product | null> {
    await this.repository.update(id, product);
    return this.repository.findOne({ where: { id } });
  }
}
