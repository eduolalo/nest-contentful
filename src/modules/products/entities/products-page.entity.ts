import { IPage, PaginatedResult } from '@common/entities';
import { Product } from '@modules/products/entities/product.entity';

export class ProductsPage extends PaginatedResult<Product>() {
  constructor(attributes: IPage<Product>) {
    super();
    Object.assign(this, attributes);
  }
}
