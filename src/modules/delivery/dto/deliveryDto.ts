import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Product } from 'src/entities/product.entity';
import { Shop } from 'src/entities/shop.entity';

class Item {
  @IsNotEmpty()
  @IsString()
  productId: Product;

  @IsNotEmpty()
  @IsString()
  price: number;

  @IsNotEmpty()
  @IsString()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  shopId: Shop;
}

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  alternatePhoneNumber?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  deliveryCharge: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}
