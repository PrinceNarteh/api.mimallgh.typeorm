import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsString()
  alternatePhoneNumber: string;

  @IsNotEmpty()
  @IsString()
  whatsappNumber: string;

  @IsArray()
  @ArrayMinSize(1)
  images: Express.Multer.File[];
}
