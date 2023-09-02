import { Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryCompanyImage } from 'src/entities/deliveryCompanyImage.entity';
import { deleteFile } from 'src/utils/deleteFile';
import { DeliveryCompanyRepository } from './delivery-company.repository';
import { CreateDeliveryCompanyDto } from './dto/delivery-company.dto';
import { DeliveryCompanyDocument } from './schema/delivery-company.schema';

@Injectable()
export class DeliveryCompaniesService {
  constructor(
    private readonly deliveryCompanyRepo: DeliveryCompanyRepository,
  ) {}

  async findAll(): Promise<DeliveryCompanyDocument[]> {
    return this.deliveryCompanyRepo.find({});
  }

  async findOne(id: string): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyRepo.findOne({ _id: id });
  }

  async findOneBySlug(slug: string): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyRepo.findOneBySlug(slug);
  }

  async create(
    createProductDto: CreateDeliveryCompanyDto,
    imageNames: Array<string>,
  ): Promise<DeliveryCompanyDocument> {
    const product = this.deliveryCompanyRepo.create({
      ...createProductDto,
      images: imageNames,
    });

    return this.deliveryCompanyRepo.create(product);
  }

  async update(
    deliveryCompanyId: string,
    updateDeliveryCompanyDto: Partial<CreateDeliveryCompanyDto>,
    imageNames?: Array<string>,
  ): Promise<DeliveryCompanyDocument | null> {
    const deliveryCompany = await this.deliveryCompanyRepo.findOne({
      id: deliveryCompanyId,
    });
    if (!deliveryCompany) {
      throw new NotFoundException('delivery company not found');
    }

    return this.deliveryCompanyRepo.findOne(
      { id: deliveryCompanyId },
      {
        ...updateDeliveryCompanyDto,
        ...(imageNames.length > 0 && {
          images: [...deliveryCompany.images, ...imageNames],
        }),
      },
    );
  }

  async delete(
    deliveryCompanyId: string,
  ): Promise<DeliveryCompanyDocument | null> {
    const deliveryCompany = await this.deliveryCompanyRepo.findOne({
      id: deliveryCompanyId,
    });

    if (!deliveryCompany) return null;

    deliveryCompany.images.forEach((image) => {
      deleteFile(image, 'slides');
    });

    return this.deliveryCompanyRepo.delete({ id: deliveryCompanyId });
  }

  // async findImage(imageId: string) {
  //   const img = this.deliveryCompanyImgRepo.findOne({ where: { id: imageId } });

  //   if (!img) {
  //     throw new NotFoundException('Product Image Not Found');
  //   }

  //   return img;
  // }

  async deleteImage({
    deliveryCompanyId,
    imageName,
  }: {
    deliveryCompanyId: string;
    imageName: string;
  }) {
    deleteFile(imageName, 'slides');

    return await this.findOne(deliveryCompanyId);
  }
}
