import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import { Shop } from 'src/entities/shop.entity';
import { pad } from 'src/utils/pad';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateShopDto } from './dto/shopDto';
import { ShopImage } from 'src/entities/shopImage.entity';

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

  async shop(id: string): Promise<Shop | null> {
    const shop = await this.shopRepo.findOne({
      where: { id },
      relations: {
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
    return this.shopRepo.findOne({
      where: { shopCode },
      relations: {
        image: true,
        products: true,
      },
    });
  }

  async shops(params: {
    skip?: number;
    take?: number;
    where?: FindOptionsWhere<Shop>;
    order?: FindOptionsOrder<Shop>;
  }): Promise<Shop[]> {
    const { skip, take, where, order } = params;
    return await this.shopRepo.find({
      skip,
      take,
      where,
      order,
      relations: {
        image: true,
        products: true,
      },
    });
  }

  async createShop(data: CreateShopDto) {
    const shops = await this.shopRepo.find({
      order: {
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

    const shop = this.shopRepo.create({
      ...data,
      shopCode,
      plainPassword: password,
      password: hashPassword,
    });

    await this.shopRepo.save(shop);

    return shop;
  }

  async updateShop(shopId: string, updateShopDto: any) {
    const shop = await this.shopRepo.findOne({
      where: { id: shopId },
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const { image, ...data } = updateShopDto;

    if (image) {
      await this.shopImgRepo.delete({
        shopId: {
          id: shopId,
        },
      });

      const shopImage = this.shopImgRepo.create({
        ...image,
        shop,
      });
      await this.shopImgRepo.save(shopImage);
      const updatedShopData = {
        ...data,
        image: shopImage,
      };

      const updatedShop = Object.assign(shop, updatedShopData);
      await updatedShop.save();
    } else {
      const updatedShop = Object.assign(shop, updateShopDto);
      await updatedShop.save();
    }

    return await this.shop(shopId);
  }

  async deleteShop(id: string) {
    const shop = await this.shop(id);
    if (!shop) return null;
    await this.shopImgRepo.delete({ shopId: { id } });
    await this.shopRepo.delete(id);
    return 'Shop deleted successfully';
  }
}
