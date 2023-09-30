import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductImageDto {
  @IsNotEmpty()
  name: Express.Multer.File;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  @Transform(({ value }) => parseInt(value, 10))
  price: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  discountPercentage: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
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

  images: Express.Multer.File[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class AdminCreateProductDto extends CreateProductDto {
  @IsNotEmpty()
  @IsString()
  shopId: string;
}
