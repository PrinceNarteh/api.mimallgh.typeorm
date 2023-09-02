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
import { FilesInterceptor } from '@nestjs/platform-express';
import { SharpFilesInterceptorPipe } from 'src/shared/pipes/sharp.pipe';
import { DeliveryCompaniesService } from './delivery-companies.service';
import { CreateDeliveryCompanyDto } from './dto/delivery-company.dto';
import { join } from 'path';

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
  async createDeliveryCompany(
    @Body() createProductDto: CreateDeliveryCompanyDto,
    @UploadedFiles(new SharpFilesInterceptorPipe('slides'))
    imageNames: Array<string>,
  ) {
    return this.deliveryCompaniesService.create(createProductDto, imageNames);
  }

  @Patch(':deliveryCompanyId')
  @UseInterceptors(FilesInterceptor('newImages', 4))
  async updateDeliveryCompany(
    @Param('deliveryCompanyId') deliveryCompanyId: string,
    @Body() updateDeliveryCompanyDto: Partial<CreateDeliveryCompanyDto>,
    @UploadedFiles(new SharpFilesInterceptorPipe('slides'))
    imageNames?: Array<string>,
  ) {
    return this.deliveryCompaniesService.update(
      deliveryCompanyId,
      updateDeliveryCompanyDto,
      imageNames,
    );
  }

  @Delete(':deliveryCompanyId')
  async deleteDeliveryCompany(
    @Param('deliveryCompanyId') deliveryCompanyId: string,
  ) {
    return this.deliveryCompaniesService.delete(deliveryCompanyId);
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
