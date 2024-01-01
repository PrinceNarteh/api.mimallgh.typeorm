import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  @IsNotEmpty({ message: 'Shop ID is required' })
  shopId: string;

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
  discount_percentage: number;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  stock: number;

  @IsString()
  brand: string;

  @IsEnum(ProductCategory, { always: true, each: true })
  category: ProductCategory;

  // @ArrayMinSize(1)
  product_images: any;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class AdminCreateProductDto extends CreateProductDto {
  @IsNotEmpty()
  @IsString()
  shop_id: string;
}

export class DeleteProductImageDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @IsNotEmpty()
  @IsString()
  image_name: string;
}
