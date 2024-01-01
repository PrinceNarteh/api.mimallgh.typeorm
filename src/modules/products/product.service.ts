import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ShopService } from 'src/modules/shops/shops.service';
import { deleteFile } from 'src/utils/deleteFile';
import { ShopDocument } from '../shops/schema/shop.schema';
import {
  AdminCreateProductDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/productDto';
import { ProductRepository } from './product.repository';
import { ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly shopService: ShopService,
  ) {}

  async getAllProducts(
    filter: FilterQuery<ProductDocument>,
  ): Promise<ProductDocument[]> {
    return this.productRepo.find({});
  }

  async getProduct(id: string): Promise<ProductDocument> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async categorizedProducts(params: FilterQuery<ProductDocument>) {
    const {
      currentPage,
      perPage,
      findOptions: { skip, where, order },
    } = params;

    return this.productRepo.find({});
  }

  async getProductsByShop(
    shopId: string,
    params: FilterQuery<ProductDocument>,
  ): Promise<ProductDocument[]> {
    const {
      currentPage,
      perPage,
      findOptions: { skip, order, take },
    } = params;

    return this.productRepo.find({ shop: shopId });
  }

  async createProduct(
    createProductDto: CreateProductDto,
    product_images: Array<string>,
  ): Promise<ProductDocument> {
    const shop = await this.shopService.getShop(createProductDto.shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return this.productRepo.create({
      ...createProductDto,
      shop: shop._id,
      product_images,
    });
  }

  async adminCreateProduct(
    createProductDto: Partial<AdminCreateProductDto>,
    product_images: Array<string>,
  ): Promise<ProductDocument> {
    const shop = await this.shopService.getShop(createProductDto.shop_id);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.productRepo.create({ ...createProductDto, product_images });
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    product_images?: Array<string>,
  ) {
    const product = await this.getProduct(productId);

    return this.productRepo.findByIdAndUpdate(productId, {
      ...updateProductDto,
      ...(product_images?.length > 0 && {
        product_images: [...product.product_images, product_images],
      }),
    });
  }

  async adminUpdateProduct(
    productId: string,
    updateProductDto: Partial<AdminCreateProductDto>,
    product_images?: Array<string>,
  ) {
    const product = await this.getProduct(productId);

    return this.productRepo.findByIdAndUpdate(product._id, {
      ...updateProductDto,
      ...(product_images?.length > 0 && {
        product_images: [...product.product_images, product_images],
      }),
    });
  }

  async deleteProduct(
    shop: ShopDocument,
    productId: string,
  ): Promise<ProductDocument> {
    const product = await this.productRepo.findById(productId);

    if (!product) return null;

    if (product && shop.id !== product.shop) {
      throw new ForbiddenException(
        'You are not permitted to perform this action',
      );
    }

    for (let image of product.product_images) {
      deleteFile(image, 'products');
    }

    await this.productRepo.delete(productId);
  }

  async deleteProductImage({
    product_id,
    image_name,
  }: {
    product_id: string;
    image_name: string;
  }) {
    const product = await this.getProduct(product_id);

    deleteFile(image_name, 'products');

    return await this.productRepo.findByIdAndUpdate(product_id, {
      product_images: product.product_images.filter(
        (image) => image !== image_name,
      ),
    });
  }
}
