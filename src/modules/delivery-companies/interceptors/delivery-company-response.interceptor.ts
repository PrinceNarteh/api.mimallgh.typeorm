import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { DeliveryCompanyDocument } from '../schema/delivery-company.schema';

export class DCResInterceptor implements NestInterceptor {
  async intercept(
    _: ExecutionContext,
    next: CallHandler<DeliveryCompanyDocument | DeliveryCompanyDocument[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? data.map((company) => this.transformResponse(domain, company))
            : this.transformResponse(domain, data),
        ),
      );
  }

  transformResponse(domain: string, data: DeliveryCompanyDocument) {
    return {
      ...data.toObject(),
      ...(data.logo && {
        logo: `${domain}/delivery-companies/image/${data.logo}`,
      }),
      slide_images: data.slide_images.map(
        (image) => `${domain}/delivery-companies/image/${image}`,
      ),
    };
  }
}
