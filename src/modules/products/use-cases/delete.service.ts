import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Product } from '@modules/products/entities';

@Injectable()
export class DeleteService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async run(id: string): Promise<Product | object> {
    const exists = await this.repository.existsBy({ id });
    if (!exists) return {};

    await this.repository.softDelete({ id });
    const productDeleted = await this.repository.findOne({ where: { id }, withDeleted: true });
    return productDeleted || {};
  }
}
