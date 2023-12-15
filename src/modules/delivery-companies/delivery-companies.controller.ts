import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
  Delete,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  SharpFileFieldsInterceptorPipe,
  SharpFilesInterceptorPipe,
} from 'src/shared/pipes/sharp.pipe';
import { DeliveryCompaniesService } from './delivery-companies.service';
import { CreateDeliveryCompanyDto } from './dto/delivery-company.dto';
import { join } from 'path';
import { LoginDto } from 'src/common/login-dto';
import { LoginResponseType } from 'src/custom-types';

@Controller('delivery-companies')
export class DeliveryCompaniesController {
  constructor(
    private readonly deliveryCompaniesService: DeliveryCompaniesService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.deliveryCompaniesService.login(loginDto);
  }

  @Get()
  async findAll() {
    return this.deliveryCompaniesService.getAllDeliveryCompanies();
  }

  @Get(':deliveryCompanyId')
  async findOne(@Param('deliveryCompanyId') deliveryCompanyId: string) {
    const deliveryCompany =
      await this.deliveryCompaniesService.getDeliveryCompany(deliveryCompanyId);
    if (!deliveryCompany) {
      throw new NotFoundException('Deliveries not found');
    }
    return deliveryCompany;
  }

  @Get('/slug/:deliveryCompanySlug')
  async findOneBySlug(
    @Param('deliveryCompanySlug') deliveryCompanySlug: string,
  ) {
    const deliveryCompany =
      await this.deliveryCompaniesService.getDeliveryCompanyBySlug(
        deliveryCompanySlug,
      );
    if (!deliveryCompany) {
      throw new NotFoundException('Deliveries not found');
    }
    return deliveryCompany;
  }

  @Post('/register')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'logo',
        maxCount: 1,
      },
      { name: 'slide_images', maxCount: 4 },
    ]),
  )
  async createDeliveryCompany(
    @Body() createProductDto: CreateDeliveryCompanyDto,
    @UploadedFiles(new SharpFileFieldsInterceptorPipe('slides'))
    images: {
      logo: Express.Multer.File[];
      slide_images: Express.Multer.File[];
    },
  ) {
    console.log(images);
    // return this.deliveryCompaniesService.createDeliveryCompany(
    //   createProductDto,
    //   'images.logo',
    //   ['images.slide_images'],
    // );
    return 'created';
  }

  @Patch(':deliveryCompanyId')
  @UseInterceptors(FilesInterceptor('newImages', 4))
  async updateDeliveryCompany(
    @Param('deliveryCompanyId') deliveryCompanyId: string,
    @Body() updateDeliveryCompanyDto: Partial<CreateDeliveryCompanyDto>,
    @UploadedFiles(new SharpFileFieldsInterceptorPipe('slides'))
    imageNames?: Array<string>,
  ) {
    return this.deliveryCompaniesService.updateDeliveryCompany(
      deliveryCompanyId,
      updateDeliveryCompanyDto,
      imageNames,
    );
  }

  @Delete(':deliveryCompanyId')
  async deleteDeliveryCompany(
    @Param('deliveryCompanyId') deliveryCompanyId: string,
  ) {
    return this.deliveryCompaniesService.deleteDeliveryCompany(
      deliveryCompanyId,
    );
  }

  @Get('/image/:imageName')
  async findImage(@Param('imageName') imageName: string, @Res() res) {
    res.sendFile(join(process.cwd(), 'uploads/slides/' + imageName));
  }

  @Delete('/:deliveryCompanyId/image/:imageId')
  async deleteImage(
    @Param() param: { deliveryCompanyId: string; imageName: string },
  ) {
    return this.deliveryCompaniesService.deleteImage(param);
  }
}
