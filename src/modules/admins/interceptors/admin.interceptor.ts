import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';
import { app } from 'src/main';
import { AdminDocument } from '../schemas/admin.schema';

export class AdminInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<AdminDocument>,
  ): Promise<Observable<AdminDocument>> | Promise<Observable<AdminDocument>> {
    const domain = await app.getUrl();
    const data = await firstValueFrom(next.handle());

    const res = {
      ...data.toObject(),
      profile_image: `${domain}/admins/image/${data.profile_image}`,
    };

    return res;
  }
}
