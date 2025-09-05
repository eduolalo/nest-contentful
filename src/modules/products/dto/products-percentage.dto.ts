import { IsISO8601, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductsPercentageDto {
  @ApiProperty({ description: 'Product price', required: false, minimum: 0 })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ description: 'From date in ISO 8601 format', required: false })
  @IsOptional()
  @IsISO8601()
  @Type(() => String)
  fromDate?: string;

  @ApiProperty({ description: 'To date in ISO 8601 format', required: false })
  @IsOptional()
  @IsISO8601()
  @Type(() => String)
  toDate?: string;
}
