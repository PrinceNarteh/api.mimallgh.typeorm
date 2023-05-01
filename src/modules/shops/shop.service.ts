import { Injectable, NotFoundException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

import { Prisma, Shop } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateShopDto } from './dto/shopDto';
import { pad } from 'src/utils/pad';

@Injectable()
export class ShopService {
  constructor(private readonly prismaService: PrismaService) {}

  async shop(id: string): Promise<Shop | null> {
    const shop = await this.prismaService.shop.findUnique({
      where: { id },
      include: {
        image: true,
        products: true,
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop Not Found');
    }
    return shop;
  }

  async findShopByShopCode(shopCode: string): Promise<Shop | null> {
    return this.prismaService.shop.findFirst({
      where: { shopCode },
      include: {
        image: true,
        products: true,
      },
    });
  }

  async shops(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ShopWhereUniqueInput;
    where?: Prisma.ShopWhereInput;
    orderBy?: Prisma.ShopOrderByWithRelationInput;
  }): Promise<Shop[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prismaService.shop.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        image: true,
        products: true,
      },
    });
  }

  async createShop(data: CreateShopDto) {
    const shops = await this.prismaService.shop.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });

    const password = nanoid(10);
    const hashPassword = await bcrypt.hash(password, 12);

    let shopCode: string;
    const year = new Date().getFullYear().toString().substring(2);

    if (shops.length === 0) {
      shopCode = `CRCC${year}000001`;
    } else {
      const lastItem = shops[0].shopCode.split(year)[1];
      const index = pad(lastItem);
      shopCode = `CRCC${year}${index}`;
    }

    return this.prismaService.shop.create({
      data: {
        ...data,
        shopCode,
        plainPassword: password,
        password: hashPassword,
      },
    });
  }

  async updateShop(shopId: string, data: any) {
    const shop = await this.shop(shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return this.prismaService.shop.update({ where: { id: shopId }, data });
  }

  async deleteShop(id: string) {
    return this.prismaService.shop.delete({ where: { id } });
  }
}
