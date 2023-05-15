import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @IsPositive()
  quantity: number;

  @IsPositive()
  price: number;

  @IsString()
  productId: string;

  @IsString()
  shopId: string;
}

export class CreateOrderDto {
  @IsInt()
  amount: number;

  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
