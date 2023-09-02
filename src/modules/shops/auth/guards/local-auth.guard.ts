import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ShopLocalAuthGuard extends AuthGuard('local-shop') {}
