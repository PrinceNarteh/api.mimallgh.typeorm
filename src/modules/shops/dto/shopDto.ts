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
  shopCode: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  plainPassword: string;

  @IsString()
  location: string;

  @IsString()
  mapDirection: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  alternateNumber: string;

  @IsString()
  @IsOptional()
  whatsappNumber: string;

  @IsString()
  @IsOptional()
  instagramHandle: string;

  @IsString()
  @IsOptional()
  facebookHandle: string;

  @IsString()
  openingTime: string;

  @IsString()
  closingTime: string;

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
