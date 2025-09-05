import { IsISO8601, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductsPercentageDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsISO8601()
  @Type(() => String)
  fromDate?: string;

  @IsOptional()
  @IsISO8601()
  @Type(() => String)
  toDate?: string;
}
