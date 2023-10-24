import {
  Injectable,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { AuthRoutes } from '../pipes/register.pipe';

@Injectable()
export class RegisterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const entity = context.switchToHttp().getRequest().params.entity;
    if (![...Object.values(AuthRoutes)].includes(entity)) {
      throw new NotFoundException('URL not found');
    }
    return next.handle();
  }
}
