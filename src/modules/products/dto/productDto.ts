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

export enum ProductCategory {
  food = 'food',
  fashion_and_wears = 'fashion_and_wears',
  grocery_and_general = 'grocery_and_general',
  health_and_wellness = 'health_and_wellness',
  home_and_electrical_appliances = 'home_and_electrical_appliances',
  personal_services = 'personal_services',
  printing_and_stationery = 'printing_and_stationery',
  tech = 'tech',
}

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
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  discountPercentage: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  stock: number;

  @IsString()
  brand: string;

  @IsEnum(ProductCategory, { always: true, each: true })
  category: ProductCategory;

  images: Express.Multer.File[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class AdminCreateProductDto extends CreateProductDto {
  @IsNotEmpty()
  @IsString()
  shopId: string;
}
