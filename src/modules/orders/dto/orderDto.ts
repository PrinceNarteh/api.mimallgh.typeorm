import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  shop_id: string;
}

export class CreateOrderDto {
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  alternate_phone_number: string;

  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
