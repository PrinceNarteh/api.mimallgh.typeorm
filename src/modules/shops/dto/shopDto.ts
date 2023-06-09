import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
