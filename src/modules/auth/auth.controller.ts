import { Controller, Param, Post, Body, UseInterceptors } from '@nestjs/common';
import { RegisterBodyValidationPipe } from './pipes/register.pipe';
import { RegisterInterceptor } from './interceptors/register.interceptor';

const getDto = (entity: string) => {
  if (entity === 'user') {
    return 'string';
  } else {
    return 'number';
  }
};

@UseInterceptors(RegisterInterceptor)
@Controller('auth')
export class AuthController {
  @Post(':entity/register')
  register(@Body(RegisterBodyValidationPipe) body: any) {
    return 'Registered';
  }
}
