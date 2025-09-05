import { IsInt, MaxLength, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { ApiProperty, ApiResponseNoStatusOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { Product } from '@modules/products/entities';

export class ListProductsDto {
  @ApiProperty({ description: 'Page number', default: 1 })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ description: 'Number of items per page', default: 5, maximum: 5, minimum: 1 })
  @IsInt()
  @Max(5)
  @Min(1)
  @Type(() => Number)
  itemsPerPage: number = 5;

  @ApiProperty({ description: 'Stock Keeping Unit', maxLength: 128, required: false })
  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  sku?: string;

  @ApiProperty({ description: 'Product name', maxLength: 255, required: false })
  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  name?: string;

  @ApiProperty({ description: 'Product brand', maxLength: 128, required: false })
  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  brand?: string;

  @ApiProperty({ description: 'Product model', maxLength: 128, required: false })
  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  model?: string;

  @ApiProperty({ description: 'Product category', maxLength: 128, required: false })
  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  category?: string;

  @ApiProperty({ description: 'Product color', maxLength: 128, required: false })
  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  color?: string;

  @ApiProperty({ description: 'Product price', required: false, minimum: 0 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ description: 'Currency code', maxLength: 3, required: false })
  @IsOptional()
  @MaxLength(3)
  @Type(() => String)
  currency?: string;

  @ApiProperty({ description: 'Available stock', required: false, minimum: 0 })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  stock?: number;
}

const exampleItem: Product = {
  id: '21fc4b41-2cb7-49b1-9003-808390c73aa9',
  externalId: 'P7KF2h75oMFRKNmxq1EIl',
  publishedVersion: 1,
  revision: 1,
  sku: 'PXT8I2VC',
  name: 'Acer Tab S7',
  brand: 'Acer',
  model: 'Tab S7',
  category: 'Tablet',
  color: 'Rose Gold',
  price: 767.75,
  currency: 'USD',
  stock: 93,
  createdAt: new Date('2024-01-23T21:47:07.025Z'),
  updatedAt: new Date('2024-01-23T21:47:07.025Z'),
  fetchedAt: new Date('2025-09-05T17:00:00.412Z'),
  deletedAt: null,
};

export const ListProductsSchema: ApiResponseNoStatusOptions = {
  description: 'Schema for listing products with pagination and optional filters',
  type: ListProductsDto,
  example: {
    pagination: {
      page: 1,
      itemsPerPage: 5,
      totalItems: 97,
      totalPages: 20,
    },
    items: [exampleItem],
  },
};

export const ProductDeletedSchema: ApiResponseNoStatusOptions = {
  description: 'Schema for deleted product response',
  type: Product,
  example: {
    ...exampleItem,
    deletedAt: new Date('2024-06-01T12:00:00.000Z'),
  },
};
