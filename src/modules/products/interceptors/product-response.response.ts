import { CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { ProductDocument } from '../schema/product.schema';

export class ProductResInterceptor implements NestInterceptor {
  async intercept(
    _,
    next: CallHandler<ProductDocument | ProductDocument[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? data.map((product) => this.transformResponse(domain, product))
            : this.transformResponse(domain, data),
        ),
      );
  }

  transformResponse(domain: string, data: ProductDocument) {
    return {
      ...data.toObject(),
      product_images: data.product_images.map(
        (image) => `${domain}/products/image/${image}`,
      ),
    };
  }
}
