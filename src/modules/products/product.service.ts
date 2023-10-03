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
    shopId: string,
    createProductDto: CreateProductDto,
    imageNames: Array<string>,
  ): Promise<ProductDocument> {
    const shop = await this.shopService.getShop(shopId);
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }
    return this.productRepo.create({
      ...createProductDto,
      shop: shop._id,
    });
  }

  async adminCreateProduct(
    createProductDto: Partial<AdminCreateProductDto>,
    imageNames: Array<string>,
  ): Promise<ProductDocument> {
    const shop = await this.shopService.getShop(createProductDto.shopId);

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.productRepo.create(createProductDto);
  }

  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    imageNames?: Array<string>,
  ) {
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productRepo.findByIdAndUpdate(productId, updateProductDto);
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

    return this.productRepo.findByIdAndUpdate(product._id, updateProductDto);
  }

  async deleteProduct(shop: ShopDocument, productId: string) {
    const product = await this.productRepo.findById(productId);

    if (!product) return null;

    if (product && shop.id !== product.shop) {
      throw new ForbiddenException(
        'You are not permitted to perform this action',
      );
    }

    return 'Product deleted successfully';
  }

  async findProductImage(imageId: string) {
    const img = this.productRepo.findById(imageId);

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
    await this.productRepo.delete(imageId);

    if (img) deleteFile('img', 'products');

    return await this.getProduct(productId);
  }
}
