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
  shopId: string;
}

export class CreateQuickOrderDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  alternatePhoneNumber: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateQuickOrderItemDto)
  items: CreateQuickOrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateQuickOrderDto) {}
