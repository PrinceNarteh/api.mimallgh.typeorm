import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Express } from 'express';

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

  @Type(() => File)
  image: File;

  @Type(() => File)
  banner: File;
}

export class UpdateShopDto extends PartialType(CreateShopDto) {}
