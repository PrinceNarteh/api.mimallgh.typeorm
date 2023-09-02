import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ShopJwtGuard extends AuthGuard('jwt-shop') {}
