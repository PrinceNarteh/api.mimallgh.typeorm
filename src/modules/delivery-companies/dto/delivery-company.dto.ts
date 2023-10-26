import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLE } from 'src/constants';

export class CreateDeliveryCompanyDto {
  @IsString()
  @IsNotEmpty({ message: "Owner's first name is required" })
  ownerFirstName: string;

  @IsString()
  @IsNotEmpty({ message: "Owner's last name is required" })
  ownerLastName: string;

  @MinLength(10, { message: 'Phone number is not valid' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  @IsNotEmpty()
  ownerPhoneNumber: string;

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
  phoneNumber: string;

  @IsString()
  @IsOptional()
  alternatePhoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Location is required' })
  location: string;

  @MinLength(10, { message: 'Phone number is not valid' })
  @IsNumberString({}, { message: 'Please enter a valid phone number' })
  @IsNotEmpty({ message: 'Whatsapp number is required' })
  whatsappNumber: string;

  @IsEnum(Object.keys(ROLE), {
    message: `role must be one of the following values: ${Object.keys(ROLE)}`,
  })
  role: string;

  slide_images: Express.Multer.File[];
}
