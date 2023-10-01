import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ShopRefreshJwtGuard extends AuthGuard('jwt-refresh-shop') {}
