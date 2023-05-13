import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chain, uniqBy, filter } from 'lodash';
import { Product } from 'src/entities/product.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import { Shop } from 'src/entities/shop.entity';
import { ShopService } from 'src/modules/shops/shop.service';
import {
  FindManyReturnType,
  IFindManyOptions,
  returnValue,
} from 'src/types/findManyOptions';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto/productDto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImgRepo: Repository<ProductImage>,
    private readonly shopService: ShopService,
  ) {}

  async getAllProducts(queries: { [key: string]: string }) {
    const keys = Object.keys(queries);
    const take = Number(queries.perPage) || 10;
    const page = Number(queries.page) || 1;

    let findManyOptions: FindManyOptions<Product> = {
      take,
      skip: (page - 1) * take,
      relations: {
        shop: true,
        images: true,
      },
      select: {
        shop: {
          id: true,
          name: true,
          location: true,
        },
      },
    };

    if (keys.includes('category')) {
      findManyOptions.where = {
        category: queries.category,
      };
    }

    if (keys.includes('location')) {
      findManyOptions.where = {
        shop: {
          location: queries.location,
        },
      };
    }

    if (keys.includes('search')) {
      findManyOptions.where = [
        { title: ILike(`%${queries.search}%`) },
        { description: ILike(`%${queries.search}%`) },
      ];
    }

    let [products, total] = await this.productRepo.findAndCount(
      findManyOptions,
    );

    let sortedData = uniqBy(products, 'id');

    if (keys.includes('category')) {
      sortedData = filter(sortedData, { category: queries.category });
      total = sortedData.length;
    }

    if (keys.includes(`${keys.find((val) => /categori[sz]ed/.test(val))}`)) {
      const res = chain(sortedData)
        .uniqBy('id')
        .groupBy('category')
        .map((value, key) => ({
          category: key,
          data: value,
        }))
        .sortBy('category')
        .value();

      return {
        total: total,
        page: Number(page),
        perPage: Number(take),
        totalPages: Math.ceil(sortedData.length / take),
        data: res,
      };
    }

    return {
      total,
      page: Number(page),
      perPage: Number(take),
      totalPages: Math.ceil(total / take),
      data: sortedData,
    };
  }

  async product(id: string): Promise<Product | null> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        images: true,
        shop: true,
      },
      select: {
        shop: {
          id: true,
          shopCode: true,
          name: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async categorizedProducts(params: IFindManyOptions<Product>) {
    const {
      currentPage,
      perPage,
      findOptions: { skip, where, order },
    } = params;

    const [products, total] = await this.productRepo.findAndCount({
      skip,
      where,
      order,
      relations: {
        images: true,
        shop: true,
      },
      select: {
        shop: {
          id: true,
          shopCode: true,
          name: true,
        },
      },
    });

    const res = chain(products)
      .uniqBy('id')
      .groupBy('category')
      .map((value, key) => ({
        category: key,
        data: value,
      }))
      .sortBy('category')
      .value();

    return res;
  }

  async productsByShop(
    shopId: string,
    params: IFindManyOptions<Product>,
  ): Promise<FindManyReturnType<Product>> {
    const {
      currentPage,
      perPage,
      findOptions: { skip, order, take },
    } = params;

    const [products, total] = await this.productRepo.findAndCount({
      where: {
        shop: {
          id: shopId,
        },
      },
      skip,
      take,
      order,
      relations: {
        shop: true,
        images: true,
      },
      select: {
        shop: {
          id: true,
          shopCode: true,
          name: true,
        },
      },
    });

    return returnValue({
      total,
      currentPage,
      perPage,
      data: products,
    });
  }

  async createProduct(shopId: string, createProductDto: CreateProductDto) {
    const shop = await this.shopService.shop(shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const { images, ...data } = createProductDto;
    const productImages = [];

    for (let image of images) {
      const productImage = this.productImgRepo.create(image);
      await this.productImgRepo.save(productImage);
      productImages.push(productImage);
    }

    const product = this.productRepo.create({
      ...data,
      images: productImages,
      shop,
    });

    await this.productRepo.save(product);

    return product;
  }

  async updateProduct(
    shop: { id: string; shopCode: string },
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: {
        shop: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.shop.id !== shop.id) {
      throw new ForbiddenException(
        'You are not permitted to perform this action',
      );
    }

    await this.productImgRepo.delete({
      productId: {
        id: productId,
      },
    });

    const { images, ...data } = updateProductDto;
    const productImages = [];

    if (images) {
      for (let image of images) {
        const productImage = this.productImgRepo.create(image);
        await this.productImgRepo.save(productImage);
        productImages.push(productImage);
      }
    }

    const updatedProductData = {
      ...data,
      images: productImages,
    };

    const updatedProduct = Object.assign(product, updatedProductData);
    await updatedProduct.save();

    return updatedProduct;
  }

  async deleteProduct(shop: Shop, productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: {
        shop: true,
      },
    });

    if (!product) return null;

    if (product && shop.id !== product.shop.id) {
      throw new ForbiddenException(
        'You are not permitted to perform this action',
      );
    }

    await this.productImgRepo.delete({
      productId: {
        id: productId,
      },
    });

    await this.productRepo.delete(productId);

    return 'Product deleted successfully';
  }
}
