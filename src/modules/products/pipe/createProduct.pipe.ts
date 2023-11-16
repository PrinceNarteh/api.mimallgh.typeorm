import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateProductDto } from '../dto/productDto';

@Injectable()
export class TransformDtoPipe implements PipeTransform {
  transform(createProduct: CreateProductDto): CreateProductDto {
    const { discount_percentage, price, stock } = createProduct;

    if (typeof discount_percentage === 'string') {
      createProduct.discount_percentage = Number(discount_percentage);
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
