import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createFindOptions } from 'src/utils/findManyOptions';
import { SharpFilesInterceptorPipe } from '../../shared/pipes/sharp.pipe';
import { AdminCreateProductDto, CreateProductDto } from './dto/productDto';
import { ProductResInterceptor } from './interceptors/product-response.response';
import { TransformDtoPipe } from './pipe/createProduct.pipe';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseInterceptors(ProductResInterceptor)
  async getAllProducts(@Query() query?: { [key: string]: string }) {
    return this.productService.getAllProducts(query);
  }

  @Get('category')
  async getCategorizedProducts(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    const findOptions = createFindOptions({
      page,
      perPage,
      search,
      order,
    });

    return this.productService.categorizedProducts(findOptions);
  }

  @Get(':shopId/shop')
  async getProductsByShop(
    @Param('shopId') shopId: string,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
    @Query('order') order?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    const findOptions = createFindOptions({
      order,
      page,
      perPage,
      search,
    });
    return this.productService.getProductsByShop(shopId, findOptions);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.productService.getProduct(productId);
  }

  @Post()
  // @UseGuards(ShopJwtGuard)
  @UseInterceptors(TransformDtoPipe, FilesInterceptor('product_images', 4))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
      new SharpFilesInterceptorPipe('products'),
    )
    product_images: Array<string>,
  ) {
    return this.productService.createProduct(createProductDto, product_images);
  }

  @Patch(':productId')
  // @UseGuards(ShopJwtGuard)
  @UseInterceptors(TransformDtoPipe, FilesInterceptor('newImages', 4))
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: Partial<AdminCreateProductDto>,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
      new SharpFilesInterceptorPipe('products'),
    )
    imageNames?: Array<string>,
  ) {
    return this.productService.updateProduct(
      productId,
      updateProductDto,
      imageNames,
    );
  }

  @Patch('/admin/:productId')
  // @UseGuards(ShopJwtGuard)
  @UseInterceptors(TransformDtoPipe, FilesInterceptor('newImages', 4))
  async adminUpdateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/*' })],
      }),
      new SharpFilesInterceptorPipe('products'),
    )
    imageNames?: Array<string>,
  ) {
    return this.productService.updateProduct(
      productId,
      updateProductDto,
      imageNames,
    );
  }

  // @UseGuards(ShopJwtGuard)
  @Delete(':productId')
  async deleteProduct(@Request() req, @Param('productId') productId: string) {
    return this.productService.deleteProduct(req.user, productId);
  }

  @Get('/image/:imageName')
  async getProductImage(@Param('imageName') imageName: string, @Res() res) {
    res.sendFile(join(process.cwd(), 'uploads/products/' + imageName));
  }

  @Post('/image/delete')
  async deleteProductImage(
    @Body()
    { product_id, image_name }: { product_id: string; image_name: string },
  ) {
    return this.productService.deleteProductImage({ product_id, image_name });
  }
}
