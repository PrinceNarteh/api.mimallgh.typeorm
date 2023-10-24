import { Controller, Param, Post, Body, UseInterceptors } from '@nestjs/common';
import { RegisterBodyPipe } from './interceptors/register.interceptor';

const getDto = (entity: string) => {
  if (entity === 'user') {
    return 'string';
  } else {
    return 'number';
  }
};

@Controller('auth')
export class AuthController {
  @Post(':entity/register')
  register(@Body(RegisterBodyPipe) body: any) {
    console.log({ body });
    return 'Registered';
  }
}
