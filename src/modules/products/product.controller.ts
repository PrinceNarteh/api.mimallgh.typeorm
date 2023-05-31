import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { ShopJwtGuard } from 'src/modules/shop-auth/guards/jwt-auth.guard';
import { createFindOptions } from 'src/utils/findManyOptions';
import { SharpFilesInterceptorPipe } from '../../shared/pipes/sharp.pipe';
import { CreateProductDto } from './dto/productDto';
import { TransformDtoPipe } from './pipe/createProduct.pipe';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
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
    return this.productService.productsByShop(shopId, findOptions);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.productService.product(productId);
  }

  @Post()
  @UseGuards(ShopJwtGuard)
  @UseInterceptors(TransformDtoPipe, FilesInterceptor('images', 4))
  async createProduct(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(new SharpFilesInterceptorPipe('products'))
    imageNames: Array<string>,
  ) {
    return this.productService.createProduct(
      req.user.id,
      createProductDto,
      imageNames,
    );
  }

  @Patch(':productId')
  @UseGuards(ShopJwtGuard)
  @UseInterceptors(TransformDtoPipe, FilesInterceptor('newImages', 4))
  async updateProduct(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
    @UploadedFiles(new SharpFilesInterceptorPipe('products'))
    imageNames: Array<string>,
  ) {
    return this.productService.updateProduct(
      req.user,
      productId,
      updateProductDto,
      imageNames,
    );
  }

  @UseGuards(ShopJwtGuard)
  @Delete(':productId')
  async deleteProduct(@Request() req, @Param('productId') productId: string) {
    return this.productService.deleteProduct(req.user, productId);
  }

  @Get('/image/:imageName')
  async findProductImage(@Param('imageName') imageName: string, @Res() res) {
    res.sendFile(join(process.cwd(), 'uploads/products/' + imageName));
  }

  @Delete('/:productId/image/:imageId')
  async deleteProductImage(
    @Param() param: { productId: string; imageId: string },
  ) {
    return this.productService.deleteProductImage(param);
  }
}
