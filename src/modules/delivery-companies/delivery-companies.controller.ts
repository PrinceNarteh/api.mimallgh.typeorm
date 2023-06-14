import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SharpFilesInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
import { DeliveryCompaniesService } from './delivery-companies.service';
import { CreateDeliveryCompanyDto } from './dto/delivery-company.dto';

@Controller('delivery-companies')
export class DeliveryCompaniesController {
  constructor(
    private readonly deliveryCompaniesService: DeliveryCompaniesService,
  ) {}

  @Get()
  async findAll() {
    return this.deliveryCompaniesService.findAll();
  }

  @Get(':deliveryCompanyId')
  async findOne(@Param('deliveryCompanyId') deliveryCompanyId: string) {
    const deliveryCompany = await this.deliveryCompaniesService.findOne(
      deliveryCompanyId,
    );
    if (!deliveryCompany) {
      throw new NotFoundException('Deliveries not found');
    }
    return deliveryCompany;
  }

  @Get('/slug/:deliveryCompanySlug')
  async findOneBySlug(
    @Param('deliveryCompanySlug') deliveryCompanySlug: string,
  ) {
    const deliveryCompany = await this.deliveryCompaniesService.findOneBySlug(
      deliveryCompanySlug,
    );
    if (!deliveryCompany) {
      throw new NotFoundException('Deliveries not found');
    }
    return deliveryCompany;
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 4))
  async createProduct(
    @Body() createProductDto: CreateDeliveryCompanyDto,
    @UploadedFiles(new SharpFilesInterceptorPipe('products'))
    imageNames: Array<string>,
  ) {
    return this.deliveryCompaniesService.create(createProductDto, imageNames);
  }
}
