import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chain, filter, sampleSize, uniqBy } from 'lodash';
import { Product } from 'src/entities/product.entity';
import { ProductImage } from 'src/entities/productImage.entity';
import { Shop } from 'src/entities/shop.entity';
import { ShopService } from 'src/modules/shops/shop.service';
import {
  FindManyReturnType,
  IFindManyOptions,
  returnValue,
} from 'src/types/findManyOptions';
import { Brackets, Repository } from 'typeorm';
import {
  AdminCreateProductDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/productDto';
import { deleteFile } from 'src/utils/deleteFile';

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
    const page = Number(queries.page) || 1;
    let perPage = Number(queries.perPage) || 10;

    let query = this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.shop', 'shop')
      .leftJoin('product.images', 'image');

    if (keys.includes('category'))
      query = query.andWhere(`product.category = :category`, {
        category: queries.category,
      });

    if (keys.includes('location')) {
      query = query.andWhere('shop.location = :location', {
        location: queries.location,
      });
    }

    if (keys.includes('shopId')) {
      query = query.andWhere('shop.id = :shopId', {
        shopId: queries.shopId,
      });
    }

    if (keys.includes('search')) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('product.title LIKE :title', {
            title: `%${queries.search}%`,
          })
            .orWhere('product.description LIKE :description', {
              description: `%${queries.search}%`,
            })
            .orWhere('shop.name LIKE :name', {
              name: `%${queries.search}%`,
            });
        }),
      );
    }

    let categorizedPerPage = keys.includes(
      `${keys.find((val) => /categori[sz]ed/.test(val))}`,
    )
      ? perPage * 8
      : perPage;

    let [products, total] = await query
      .skip((page - 1) * perPage)
      .take(categorizedPerPage)
      .select([
        'product.id',
        'product.title',
        'product.price',
        'product.category',
        'product.stock',
        'product.description',
        'image.id',
        'image.name',
        'shop.id',
        'shop.name',
        'shop.location',
      ])
      .getManyAndCount();

    let sortedData = uniqBy(products, 'id');

    if (keys.includes('category') && keys.includes('search')) {
      sortedData = filter(sortedData, { category: queries.category });
      total = sortedData.length;
    }

    if (keys.includes(`${keys.find((val) => /categori[sz]ed/.test(val))}`)) {
      let res = chain(sortedData)
        .uniqBy('id')
        .groupBy('category')
        .map((value, key) => ({
          category: key,
          data: value,
        }))
        .sortBy('category')
        .value();

      res = chain(res)
        .map((item) => ({
          category: item.category,
          data: sampleSize(item.data, perPage),
        }))
        .value();

      return {
        total: total,
        page: Number(page),
        perPage: Number(perPage),
        totalPages: Math.ceil(sortedData.length / perPage),
        data: res,
      };
    }

    return {
      total,
      page: Number(page),
      perPage: Number(perPage),
      totalPages: Math.ceil(total / perPage),
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

  async createProduct(
    shopId: string,
    createProductDto: CreateProductDto,
    imageNames: Array<string>,
  ) {
    const shop = await this.shopService.shop(shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const imagesArr: ProductImage[] = [];
    for (let image of imageNames) {
      const res = this.productImgRepo.create({ name: image });
      await this.productImgRepo.save(res);
      imagesArr.push(res);
    }

    const product = this.productRepo.create({
      ...createProductDto,
      shop,
      images: imagesArr,
    });

    await this.productRepo.save(product);

    return product;
  }

  async adminCreateProduct(
    createProductDto: Partial<AdminCreateProductDto>,
    imageNames: Array<string>,
  ) {
    const shop = await this.shopService.shop(createProductDto.shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    const imagesArr: ProductImage[] = [];
    for (let image of imageNames) {
      const res = this.productImgRepo.create({ name: image });
      await this.productImgRepo.save(res);
      imagesArr.push(res);
    }

    const product = this.productRepo.create({
      ...createProductDto,
      shop,
      images: imagesArr,
    });

    await this.productRepo.save(product);

    return product;
  }

  async updateProduct(
    shop: { id: string; shopCode: string },
    productId: string,
    updateProductDto: UpdateProductDto,
    imageNames?: Array<string>,
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

    const imagesArr: ProductImage[] = [];

    if (imageNames) {
      for (let image of imageNames) {
        const res = this.productImgRepo.create({ name: image });
        await this.productImgRepo.save(res);
        imagesArr.push(res);
      }
    }

    const images = JSON.parse(updateProductDto.images as any);

    const data = {
      ...updateProductDto,
      images: [...images, ...imagesArr],
    };

    const updatedProduct = Object.assign(product, data);
    await updatedProduct.save();

    return updatedProduct;
  }

  async adminUpdateProduct(
    productId: string,
    updateProductDto: Partial<AdminCreateProductDto>,
    imageNames?: Array<string>,
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

    const imagesArr: ProductImage[] = [];

    if (imageNames) {
      for (let image of imageNames) {
        const res = this.productImgRepo.create({ name: image });
        await this.productImgRepo.save(res);
        imagesArr.push(res);
      }
    }

    const images = JSON.parse(updateProductDto.images as any);

    const data = {
      ...updateProductDto,
      images: [...images, ...imagesArr],
    };

    const updatedProduct = Object.assign(product, data);
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

    product.images.forEach((image) => {
      deleteFile(image.name, 'products');
    });

    await this.productRepo.delete(productId);

    return 'Product deleted successfully';
  }

  async findProductImage(imageId: string) {
    const img = this.productImgRepo.findOne({ where: { id: imageId } });

    if (!img) {
      throw new NotFoundException('Product Image Not Found');
    }

    return img;
  }

  async deleteProductImage({
    productId,
    imageId,
  }: {
    productId: string;
    imageId: string;
  }) {
    const img = await this.findProductImage(imageId);
    await this.productImgRepo.delete({ id: imageId });

    if (img) deleteFile(img.name, 'products');

    return await this.product(productId);
  }
}
