import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateProductDto } from '../dto/productDto';

@Injectable()
export class TransformDtoPipe implements PipeTransform {
  transform(createProduct: CreateProductDto): CreateProductDto {
    const { discountPercentage, price, stock } = createProduct;

    if (typeof discountPercentage === 'string') {
      createProduct.discountPercentage = Number(discountPercentage);
    }

    if (typeof price === 'string') {
      createProduct.price = Number(price);
    }

    if (typeof stock === 'string') {
      createProduct.stock = Number(stock);
    }

    return createProduct;
  }
}
