import { CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { AdminDocument } from '../schemas/admin.schema';

export class AdminResInterceptor implements NestInterceptor {
  async intercept(
    _,
    next: CallHandler<AdminDocument | AdminDocument[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();

    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? data.map((admin) => this.transformResponse(domain, admin))
            : this.transformResponse(domain, data),
        ),
      );
  }

  transformResponse(domain: string, data: AdminDocument) {
    return {
      ...data.toObject(),
      ...(data.profile_image && {
        profile_image: `${domain}/admins/image/${data.profile_image}`,
      }),
    };
  }
}
