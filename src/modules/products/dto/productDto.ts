import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductImageDto {
  @IsString()
  public_id: string;

  @IsString()
  secure_url: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Phone number is required' })
  price: number;

  @IsNumber()
  discountPercentage: number;

  @IsNumber()
  stock: number;

  @IsString()
  brand: string;

  @IsEnum(
    [
      'food',
      'fashion_and_wears',
      'grocery_and_general',
      'health_and_wellness',
      'home_and_electrical_appliances',
      'personal_services',
      'printing_and_stationery',
      'tech',
    ],
    { always: true, each: true },
  )
  category: string;

  @ValidateNested()
  @Type(() => ProductImageDto)
  images: ProductImageDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
