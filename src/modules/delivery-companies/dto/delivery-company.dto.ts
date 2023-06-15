import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDeliveryCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  alternatePhoneNumber: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsNotEmpty()
  @IsString()
  whatsappNumber: string;

  images: Express.Multer.File[];
}
