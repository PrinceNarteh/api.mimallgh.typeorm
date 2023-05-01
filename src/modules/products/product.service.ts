import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/productDto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Prisma, Product, Shop } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async product(id: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async products(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prismaService.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        images: true,
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async createProduct(shopId: string, data: any) {
    console.log(shopId);
    const shop = await this.prismaService.shop.findUnique({
      where: { id: shopId },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const product = await this.prismaService.product.create({
      data: {
        ...data,
        shopId,
        images: {
          createMany: {
            data: data.images,
          },
        },
      },
    });

    return product;
  }

  async updateProduct(
    shop: { id: string; shopCode: string },
    productId: string,
    data: any,
  ) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shopId !== shop.id) {
      throw new ForbiddenException(
        'You are not permitted to perform this action',
      );
    }

    const instance = await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        ...data,
        images: {
          deleteMany: {
            productId,
          },
          createMany: {
            data: data.images,
          },
        },
      },
      include: {
        images: true,
      },
    });

    return instance;
  }

  async deleteProduct(shop: Shop, productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });

    if (product && shop.id !== product.shopId) {
      throw new ForbiddenException(
        'You are not permitted to perform this action',
      );
    } else if (product && shop.id === product.shopId) {
      await this.prismaService.productImage.deleteMany({
        where: { productId },
      });
      await this.prismaService.product.delete({ where: { id: productId } });
    } else {
      return null;
    }
  }
}
