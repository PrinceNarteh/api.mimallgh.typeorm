import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateShopDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  shop_code: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  plain_password: string;

  @IsString()
  location: string;

  @IsString()
  map_direction: string;

  @IsString()
  phone_number: string;

  @IsString()
  @IsOptional()
  alternate_number: string;

  @IsString()
  @IsOptional()
  whatsapp_number: string;

  @IsString()
  @IsOptional()
  instagram_handle: string;

  @IsString()
  @IsOptional()
  facebook_handle: string;

  @IsString()
  opening_time: string;

  @IsString()
  closing_time: string;

  image: Express.Multer.File;

  banner: Express.Multer.File;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {}

export class ShopLoginDto {
  @Length(12, 12, { message: 'Please enter a valid shop code' })
  @IsString()
  @IsNotEmpty()
  shopCode: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;
}
