import { Request } from 'express';
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Scope,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from 'src/modules/users/dto/userDto';
import { CreateShopDto } from 'src/modules/shops/dto/shopDto';
import { CreateDeliveryCompanyDto } from 'src/modules/delivery-companies/dto/delivery-company.dto';

@Injectable({ scope: Scope.REQUEST })
export class RegisterBodyPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async transform(value: any, { type }: ArgumentMetadata) {
    const entity = this.request.params.entity;
    let classAValidationErrors: ValidationError[] = [];

    if (type === 'body') {
      if (entity === 'users') {
        const userDto = plainToInstance(CreateUserDto, value);
        classAValidationErrors = await validate(userDto);
      } else if (entity === 'admin') {
      } else if (entity === 'delivery-companies') {
        const deliveryCompanyDto = plainToInstance(
          CreateDeliveryCompanyDto,
          value,
        );
        classAValidationErrors = await validate(deliveryCompanyDto);
      } else if (entity === 'shops') {
        const shopDto = plainToInstance(CreateShopDto, value);
        classAValidationErrors = await validate(shopDto);
      }
    }

    if (classAValidationErrors.length > 0) {
      const errors = classAValidationErrors.flatMap((error) =>
        Object.values(error.constraints),
      );
      throw new BadRequestException(errors);
    }

    return value;
  }
}
