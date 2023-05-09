import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsArray,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @IsString()
  productName: string;

  @IsPositive()
  quantity: number;

  @IsPositive()
  price: number;

  @IsString()
  shopName: string;

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
