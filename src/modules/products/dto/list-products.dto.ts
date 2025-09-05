import { IsInt, MaxLength, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsInt()
  @Max(5)
  @Min(1)
  @Type(() => Number)
  itemsPerPage: number = 5;

  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  sku?: string;

  @IsOptional()
  @MaxLength(255)
  @Type(() => String)
  name?: string;

  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  brand?: string;

  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  model?: string;

  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  category?: string;

  @IsOptional()
  @MaxLength(128)
  @Type(() => String)
  color?: string;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @MaxLength(3)
  @Type(() => String)
  currency?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  stock?: number;
}
