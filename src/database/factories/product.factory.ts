import { FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

import { Product } from '@modules/products/entities';
import dataSource from '@database/data-source';

export class ProductFactory extends Factory<Product> {
  protected entity = Product;
  protected dataSource: DataSource = dataSource;

  protected attrs(): FactorizedAttrs<Product> {
    return {
      externalId: faker.string.uuid(),
      publishedVersion: 1,
      revision: 1,
      sku: faker.string.alphanumeric(10),
      name: faker.commerce.productName(),
      brand: faker.company.name(),
      model: faker.string.alphanumeric(10),
      category: faker.commerce.department(),
      color: faker.color.human(),
      price: faker.number.float({ min: 10, max: 1000 }),
      currency: 'USD',
      stock: faker.number.int({ min: 0, max: 100 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deletedAt: null,
    };
  }
}
