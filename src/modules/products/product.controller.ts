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
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { ShopJwtGuard } from 'src/modules/shop-auth/guards/jwt-auth.guard';
import { createFindOptions } from 'src/utils/findManyOptions';
import { CreateProductDto } from './dto/productDto';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createId } from '@paralleldrive/cuid2';
import { extname, join } from 'path';
import { TransformDtoPipe } from './pipe/createProduct.pipe';

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
  @UseInterceptors(
    FilesInterceptor('images', 4, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const generatedName = createId();
          const filename = `${generatedName}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async createProduct(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(createProductDto);
    console.log(files);
    return this.productService.createProduct(
      req.user.id,
      createProductDto,
      files,
    );
  }

  @UseGuards(ShopJwtGuard)
  @Patch(':productId')
  async updateProduct(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateProductDto: Partial<CreateProductDto>,
  ) {
    return this.productService.updateProduct(
      req.user,
      productId,
      updateProductDto,
    );
  }

  @UseGuards(ShopJwtGuard)
  @Delete(':productId')
  async deleteProduct(@Request() req, @Param('productId') productId: string) {
    return this.productService.deleteProduct(req.user, productId);
  }

  @Get('/product-image/:imageName')
  async findProductImage(@Param('imageName') imageName: string, @Res() res) {
    res.sendFile(join(process.cwd(), 'uploads/products/' + imageName));
  }
}
