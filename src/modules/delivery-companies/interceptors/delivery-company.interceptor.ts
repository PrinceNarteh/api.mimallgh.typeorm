// import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
// import { Observable, firstValueFrom } from 'rxjs';
// import { app } from 'src/main';
// import {
//   DeliveryCompany,
//   DeliveryCompanyDocument,
// } from '../schema/delivery-company.schema';

// export class DeliveryCompanyInterceptor implements NestInterceptor {
//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler<DeliveryCompanyDocument>,
//   ): Promise<Observable<DeliveryCompanyDocument>> {
//     const domain = await app.getUrl();
//     const data = await firstValueFrom(next.handle());

//     const res = {
//       ...data,
//       ...(data.logo && {
//         logo: `${domain}/delivery-companies/image/${data.logo}`,
//       }),
//       slide_images: data.slide_images.map(
//         (image) => `${domain}/delivery-companies/image/${image}`,
//       ),
//     };

//     return res;
//   }
// }
