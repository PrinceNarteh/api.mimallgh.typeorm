import { OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
  @IsString()
  name: string;

  @IsPositive()
  quantity: number;

  @IsPositive()
  price: number;

  @IsString()
  shopName: string;

  @IsString()
  shopId: string;
}

export class CreateOrderDto {
  @IsInt()
  amount: number;

  @ValidateNested({
    each: true,
  })
  items: CreateOrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
