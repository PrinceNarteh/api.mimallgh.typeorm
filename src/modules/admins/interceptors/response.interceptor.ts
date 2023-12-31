import { CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { AdminDocument } from '../schemas/admin.schema';

export class ResponseInterceptor implements NestInterceptor {
  async intercept(
    _,
    next: CallHandler<AdminDocument | AdminDocument[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((admin) => ({
            ...admin.toObject(),
            profile_image: `${domain}/admins/image/${admin.profile_image}`,
          }));
        } else {
          return {
            ...data.toObject(),
            ...(data.profile_image && {
              profile_image: `${domain}/admins/image/${data.profile_image}`,
            }),
          };
        }
      }),
    );
  }
}
