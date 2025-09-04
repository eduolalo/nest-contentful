import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Product } from '@modules/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
