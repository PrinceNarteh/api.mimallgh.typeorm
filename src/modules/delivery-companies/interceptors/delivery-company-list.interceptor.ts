import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { DeliveryCompany } from '../schema/delivery-company.schema';

export class DeliveryCompanyListInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<DeliveryCompany[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();
    return next.handle().pipe(
      map((data) =>
        data.map((company) => ({
          ...company,
          ...(company.logo && {
            logo: `${domain}/delivery-companies/image/${company.logo}`,
          }),
          slide_images: company.slide_images.map(
            (image) => `${domain}/delivery-companies/image/${image}`,
          ),
        })),
      ),
    );
  }
}
