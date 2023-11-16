import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDeliveryCompanyDto {
  @IsString()
  @IsNotEmpty({ message: "Owner's first name is required" })
  owner_first_name: string;

  @IsString()
  @IsNotEmpty({ message: "Owner's last name is required" })
  owner_last_name: string;

  @MinLength(10, { message: 'Phone number is not valid' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  @IsNotEmpty()
  owner_phone_number: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @MinLength(5, { message: 'Password must be at least 6 characters' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @MinLength(10, { message: 'Phone number is not valid' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  @IsNotEmpty({ message: 'Company phone number is required' })
  phone_number: string;

  @IsString()
  @IsOptional()
  alternate_phone_number: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @MinLength(10, { message: 'Phone number is not valid' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  @IsNotEmpty({ message: 'Whatsapp number is required' })
  whatsapp_number: string;

  logo: Express.Multer.File;

  slide_images: Express.Multer.File[];
}
