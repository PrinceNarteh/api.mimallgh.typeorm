import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { uniqBy } from 'lodash';
import { customAlphabet } from 'nanoid';
import { Shop } from 'src/entities/shop.entity';
import {
  FindManyReturnType,
  IFindManyOptions,
  returnValue,
} from 'src/types/findManyOptions';
import { pad } from 'src/utils/pad';
import { Repository } from 'typeorm';
import { CreateShopDto } from './dto/shopDto';
import { chain } from 'lodash';
import { deleteFile } from 'src/utils/deleteFile';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
  ) {}

  async shop(id: string) {
    const returnShop = await this.shopRepo.findOne({
      where: { id },
      relations: {
        products: {
          images: true,
          shop: true,
        },
      },
    });

    if (!returnShop) {
      throw new NotFoundException('Shop Not Found');
    }

    let { products, ...result } = returnShop;

    let res = chain(products)
      .uniqBy('id')
      .groupBy('category')
      .map((value, key) => ({
        category: key,
        data: value,
      }))
      .sortBy('category')
      .value();

    let returnValue = {
      ...result,
      products: res,
    };

    return returnValue;
  }

  async findShopByShopCode(shopCode: string): Promise<Shop | null> {
    return this.shopRepo.findOne({
      where: { shopCode },
      relations: {
        products: true,
      },
    });
  }

  async getAllShops(): Promise<Shop[]> {
    const shops = await this.shopRepo.find({
      relations: ['products'],
    });
    return shops;
  }

  async getSingleShop(id: string): Promise<Shop | null> {
    const shop = await this.shopRepo.findOne({
      where: {
        id,
      },
      relations: ['products'],
    });
    return shop;
  }

  async shops(
    params: IFindManyOptions<Shop>,
  ): Promise<FindManyReturnType<Shop>> {
    const {
      perPage,
      currentPage,
      findOptions: { order, skip, take, where },
    } = params;

    const [shops, total] = await this.shopRepo.findAndCount({
      skip,
      take,
      where,
      order: {
        shopCode: 'ASC',
        ...order,
      },
      relations: {
        products: true,
      },
    });

    const sortedShops = uniqBy(shops, 'id');

    return returnValue({
      perPage,
      currentPage,
      total,
      data: sortedShops,
    });
  }

  async createShop(
    data: CreateShopDto,
    image?: string,
    banner?: string,
  ): Promise<Shop> {
    const shops = await this.shopRepo.find({
      order: {
        shopCode: 'desc',
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

    const shop = this.shopRepo.create({
      ...data,
      shopCode,
      image: image ? image : null,
      banner: banner ? banner : null,
      plainPassword: password,
      password: hashPassword,
    });

    await this.shopRepo.save(shop);

    return shop;
  }

  async updateShop(
    shopId: string,
    updateShopDto: any,
    newImage?: string,
    newBanner?: string,
  ): Promise<Shop> {
    const shop = await this.shopRepo.findOne({
      where: { id: shopId },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const updatedShopData = {
      ...updateShopDto,
      image: newImage ? newImage : updateShopDto.image,
      banner: newBanner ? newBanner : updateShopDto.banner,
    };

    if (newImage && shop.image !== null)
      deleteFile(updateShopDto.image, 'shops');
    if (newBanner && shop.banner !== null)
      deleteFile(updateShopDto.banner, 'shops');

    await this.shopRepo.update({ id: shopId }, updatedShopData);

    return await this.shopRepo.findOne({
      where: { id: shopId },
    });
  }

  async deleteShop(id: string) {
    const shop = await this.shop(id);
    await this.shopRepo.delete(id);
    if (shop.image) {
      deleteFile(shop.image, 'products');
    }
    if (shop.banner) {
      deleteFile(shop.banner, 'products');
    }
    return 'Shop deleted successfully';
  }

  async deleteShopImage(id: string) {
    const shop = await this.shop(id);
    deleteFile(shop.image, 'shop');
    await this.shopRepo.update({ id }, { image: null });
    return this.shop(id);
  }

  async deleteShopBanner(id: string) {
    const shop = await this.shop(id);
    deleteFile(shop.banner, 'shop');
    await this.shopRepo.update({ id }, { banner: null });
    return this.shop(id);
  }
}
