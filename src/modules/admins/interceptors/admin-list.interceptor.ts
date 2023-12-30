import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { app } from 'src/main';
import { AdminDocument } from '../schemas/admin.schema';

@Injectable()
export class AdminListInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<AdminDocument[]>,
  ): Promise<Observable<any>> | Promise<Observable<any>> {
    const domain = await app.getUrl();

    return next.handle().pipe(
      map((data) =>
        data.map((admin) => {
          return {
            ...admin.toObject(),
            profile_image: `${domain}/admins/image/${admin.profile_image}`,
          };
        }),
      ),
    );
  }
}
