import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumberString()
  phoneNumber: string;

  @IsNumberString()
  @IsOptional()
  alternateNumber: string;

  @IsString()
  @IsOptional()
  nationality: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  cardType?: string;

  @IsString()
  @IsOptional()
  cardNumber?: string;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  level: string;

  @IsString()
  @IsOptional()
  shopId: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
