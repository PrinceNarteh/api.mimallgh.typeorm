import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Request } from 'express';
import { CreateAdminDto } from 'src/modules/admins/dto/admin.dto';
import { CreateDeliveryCompanyDto } from 'src/modules/delivery-companies/dto/delivery-company.dto';
import { CreateShopDto } from 'src/modules/shops/dto/shopDto';
import { CreateUserDto } from 'src/modules/users/dto/userDto';

export enum AuthRoutes {
  Admins = 'admins',
  DeliveryCompanies = 'delivery-companies',
  users = 'users',
  shops = 'shops',
}

@Injectable({ scope: Scope.REQUEST })
export class RegisterBodyValidationPipe implements PipeTransform {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async transform(value: any, { type }: ArgumentMetadata) {
    const entity = this.request.params.entity;
    let classAValidationErrors: ValidationError[] = [];

    if (type === 'body') {
      if (entity === AuthRoutes.Admins) {
        const adminDto = plainToInstance(CreateAdminDto, value);
        classAValidationErrors = await validate(adminDto);
      } else if (entity === AuthRoutes.DeliveryCompanies) {
        const deliveryCompanyDto = plainToInstance(
          CreateDeliveryCompanyDto,
          value,
        );
        classAValidationErrors = await validate(deliveryCompanyDto);
      } else if (entity === AuthRoutes.shops) {
        const shopDto = plainToInstance(CreateShopDto, value);
        classAValidationErrors = await validate(shopDto);
      } else if (entity === AuthRoutes.users) {
        const userDto = plainToInstance(CreateUserDto, value);
        classAValidationErrors = await validate(userDto);
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
