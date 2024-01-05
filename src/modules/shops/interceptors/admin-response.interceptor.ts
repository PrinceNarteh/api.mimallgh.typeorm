import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ShopDocument } from '../schema/shop.schema';
import { app } from 'src/main';

export class ShopResInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<ShopDocument | ShopDocument[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();

    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? data.map((shop) => this.transformResponse(shop, domain))
            : this.transformResponse(data, domain),
        ),
      );
  }

  transformResponse(data: ShopDocument, domain: string) {
    return {
      ...data.toObject(),
      ...(data.profile_image && {
        profile_image: `${domain}/shops/image/${data.profile_image}`,
      }),
      ...(data.banner && { banner: `${domain}/shops/image/${data.banner}` }),
    };
  }
}
