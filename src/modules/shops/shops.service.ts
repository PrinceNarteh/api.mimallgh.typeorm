import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { chain } from 'lodash';
import { FilterQuery } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { deleteFile } from 'src/utils/deleteFile';
import { pad } from 'src/utils/pad';
import { CreateShopDto } from './dto/shopDto';
import { ShopDocument } from './schema/shop.schema';
import { ShopRepository } from './shops.repository';

const nanoid = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
);

@Injectable()
export class ShopService {
  constructor(private readonly shopRepo: ShopRepository) {}

  async getShop(id: string): Promise<ShopDocument> {
    const shop = await this.shopRepo.findById(id);
    if (!shop) {
      throw new NotFoundException('shop not found');
    }
    return shop;
  }

  async getShopByShopCode(shopCode: string): Promise<ShopDocument> {
    return this.shopRepo.findOne({ shopCode });
  }

  async getAllShops(
    filter: FilterQuery<ShopDocument>,
  ): Promise<ShopDocument[]> {
    const shops = await this.shopRepo.find(filter);
    return shops;
  }

  async createShop(
    data: CreateShopDto,
    image?: string,
    banner?: string,
  ): Promise<ShopDocument> {
    const shops = (await this.shopRepo.find({})).slice(-1);

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

    return shop;
  }

  async updateShop(
    shopId: string,
    updateShopDto: any,
    newImage?: string,
    newBanner?: string,
  ): Promise<ShopDocument> {
    const shop = await this.shopRepo.findById(shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const updatedShopData = {
      ...updateShopDto,
      ...(newImage && { image: newImage }),
      ...(newBanner && { banner: newBanner }),
    };

    if (newImage && shop.image !== null)
      deleteFile(updateShopDto.image, 'shops');
    if (newBanner && shop.banner !== null)
      deleteFile(updateShopDto.banner, 'shops');

    return this.shopRepo.findByIdAndUpdate(shopId, updatedShopData);
  }

  async deleteShop(id: string) {
    const shop = await this.getShop(id);
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
    const shop = await this.getShop(id);
    deleteFile(shop.image, 'shops');
    await this.shopRepo.findByIdAndUpdate(id, { image: null });
    return this.getShop(id);
  }

  async deleteShopBanner(id: string) {
    let shop = await this.getShop(id);
    deleteFile(shop.banner, 'shops');
    await this.shopRepo.findByIdAndUpdate(id, { banner: null });
    shop = await this.getShop(id);
    return shop;
  }
}
