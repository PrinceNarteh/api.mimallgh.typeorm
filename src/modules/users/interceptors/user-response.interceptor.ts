import { CallHandler, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { UserDocument } from '../schema/user.schema';

export class UserResInterceptor implements NestInterceptor {
  async intercept(
    _,
    next: CallHandler<UserDocument | UserDocument[]>,
  ): Promise<Observable<any>> {
    const domain = await app.getUrl();
    return next
      .handle()
      .pipe(
        map((data) =>
          Array.isArray(data)
            ? data.map((user) => this.transformResponse(domain, user))
            : this.transformResponse(domain, data),
        ),
      );
  }

  transformResponse(domain: string, data: UserDocument) {
    return {
      ...data.toObject(),
      ...(data.profile_image && {
        profile_image: `${domain}/users/image/${data.profile_image}`,
      }),
    };
  }
}
