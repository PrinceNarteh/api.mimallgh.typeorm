import { PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsString()
  @IsOptional()
  middle_name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumberString()
  phone_number: string;

  @IsNumberString()
  @IsOptional()
  alternate_phone_number: string;

  @IsString()
  @IsOptional()
  nationality: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  card_type?: string;

  @IsString()
  @IsOptional()
  card_number?: string;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  profile_image?: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
