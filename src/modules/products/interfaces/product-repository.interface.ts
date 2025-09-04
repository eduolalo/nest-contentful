import { Product } from '@modules/products/entities/product.entity';

export interface IProductRepository {
  findId(externalId: string): Promise<string | null>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Product): Promise<Product | null>;
}
