import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsNotEmpty()
  @IsString()
  request: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsString()
  @IsOptional()
  other_details?: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsString()
  @IsOptional()
  alternate_phone_number?: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  delivery_charge: number;

  @IsNotEmpty()
  @IsString()
  date_and_time: string;

  @IsNotEmpty()
  @IsString()
  delivery_company: string;
}

export class GetDeliveriesByCompanyDto {
  @IsNotEmpty()
  @IsString()
  company_id: string;
}
