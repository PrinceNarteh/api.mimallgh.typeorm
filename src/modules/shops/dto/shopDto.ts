import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Shop as ShopModel } from '@prisma/client';

export class Shop implements Shop {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  shopCode: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  plainPassword: string;

  @IsString()
  location: string;

  @IsString()
  mapDirection: string;

  @IsNumberString()
  phoneNumber: string;

  @IsNumberString()
  @IsOptional()
  alternateNumber: string;

  @IsNumberString()
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

  createdAt: Date;
  updatedAt: Date;
}

export class CreateShopDto extends OmitType(Shop, [
  'id',
  'shopCode',
  'password',
]) {
  @IsOptional()
  @IsString()
  plainPassword: string;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {}
