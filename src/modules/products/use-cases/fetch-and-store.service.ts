import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { FetchProductsService } from '@modules/contentful/use-cases';
import { IContentfulProductEntry } from '@modules/contentful/interfaces';
import { Product } from '@modules/products/entities';

@Injectable()
export class FetchAndStoreService {
  constructor(
    private readonly fetchProductsService: FetchProductsService,
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private readonly logger: Logger,
  ) {}

  private async fetch(): Promise<IContentfulProductEntry[]> {
    return this.fetchProductsService.fetchProducts();
  }

  private parseEntriesToProducts(entries: IContentfulProductEntry[]): Product[] {
    return entries.map((entry) => {
      const { sys, fields } = entry;
      const createdAt = new Date(sys.createdAt);
      const updatedAt = new Date(sys.updatedAt);

      return this.repository.create({
        externalId: sys.id,
        publishedVersion: sys.publishedVersion,
        revision: sys.revision,
        sku: fields.sku,
        name: fields.name,
        price: fields.price,
        brand: fields.brand,
        model: fields.model,
        category: fields.category,
        color: fields.color,
        currency: fields.currency,
        stock: fields.stock,
        createdAt,
        updatedAt,
      });
    });
  }

  async save(product: Product): Promise<void> {
    const productStored = await this.repository.findOne({
      select: ['id'],
      where: { externalId: product.externalId },
    });

    if (productStored) {
      product.id = productStored.id;
      return this.update(product);
    }

    try {
      await this.repository.save(product);
    } catch (error) {
      this.logger.error(`Error saving product: ${product.name}, SKU: ${product.sku}`, error);
    }
  }

  private async update(product: Product): Promise<void> {
    const { id, ...updateData } = product;

    try {
      await this.repository.update(
        { id },
        {
          ...updateData,
          fetchedAt: new Date(),
        },
      );
    } catch (error) {
      this.logger.error(`Error updating product: ${product.name}, SKU: ${product.sku}`, error);
    }
  }

  async saveMany(products: Product[] = []): Promise<void> {
    if (products.length === 0) return;

    await Promise.all(products.map((product) => this.save(product)));
  }

  async run(): Promise<void> {
    const entries = await this.fetch();
    const products = this.parseEntriesToProducts(entries);

    await this.saveMany(products);
  }
}
