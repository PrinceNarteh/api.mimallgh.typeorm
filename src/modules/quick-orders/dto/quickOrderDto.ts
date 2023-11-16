import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class CreateQuickOrderItemDto {
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  shop_id: string;
}

export class CreateQuickOrderDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  alternate_phone_number?: string;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  amount: number;

  @IsNotEmpty()
  @IsString()
  delivery_company: string;

  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  delivery_charge: number;

  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateQuickOrderItemDto)
  items: CreateQuickOrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateQuickOrderDto) {}
