import { IsString } from 'class-validator';

export class CreateUserImageDto {
  @IsString()
  public_id: string;

  @IsString()
  secure_url: string;

  @IsString()
  user_id: string;
}
