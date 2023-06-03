import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { uniqBy } from 'lodash';
import { customAlphabet } from 'nanoid';
import { Shop } from 'src/entities/shop.entity';
import { ShopImage } from 'src/entities/shopImage.entity';
import {
  FindManyReturnType,
  IFindManyOptions,
  returnValue,
} from 'src/types/findManyOptions';
import { pad } from 'src/utils/pad';
import { Repository } from 'typeorm';
import { CreateShopDto } from './dto/shopDto';
import { chain } from 'lodash';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepo: Repository<Shop>,
    @InjectRepository(ShopImage)
    private readonly shopImgRepo: Repository<ShopImage>,
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
    image?: string,
    banner?: string,
  ): Promise<Shop> {
    const shop = await this.shopRepo.findOne({
      where: { id: shopId },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const updatedShopData = {
      ...updateShopDto,
      image: image ? image : updateShopDto.image,
      banner: banner ? banner : updateShopDto.banner,
    };

    const updatedShop = Object.assign(shop, updatedShopData);
    await updatedShop.save();

    return await this.shopRepo.findOne({
      where: { id: shopId },
    });
  }

  async deleteShop(id: string) {
    const shop = await this.shop(id);
    if (!shop) return null;
    await this.shopImgRepo.delete({ shopId: { id } });
    await this.shopRepo.delete(id);
    return 'Shop deleted successfully';
  }
}
