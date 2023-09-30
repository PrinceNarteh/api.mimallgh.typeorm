import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { deleteFile } from 'src/utils/deleteFile';
import { DeliveryCompanyRepository } from './delivery-companies.repository';
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

  async findById(id: string): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyRepo.findById(id);
  }

  async findOneBySlug(slug: string): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyRepo.findOneBySlug(slug);
  }

  async create(
    createDeliveryCompanyDto: CreateDeliveryCompanyDto,
    imageNames: Array<string>,
  ): Promise<DeliveryCompanyDocument> {
    const emailExists = await this.deliveryCompanyRepo.findOne({
      email: createDeliveryCompanyDto.email,
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    return this.deliveryCompanyRepo.create(createDeliveryCompanyDto);
  }

  async update(
    deliveryCompanyId: string,
    updateDeliveryCompanyDto: Partial<CreateDeliveryCompanyDto>,
    imageNames?: Array<string>,
  ): Promise<DeliveryCompanyDocument | null> {
    const deliveryCompany = await this.deliveryCompanyRepo.findById(
      deliveryCompanyId,
    );
    if (!deliveryCompany) {
      throw new NotFoundException('Delivery company not found');
    }

    return this.deliveryCompanyRepo.findByIdAndUpdate(deliveryCompanyId, {
      ...updateDeliveryCompanyDto,
      ...(imageNames?.length > 0 && {
        images: [...deliveryCompany.images, ...imageNames],
      }),
    });
  }

  async delete(
    deliveryCompanyId: string,
  ): Promise<DeliveryCompanyDocument | null> {
    const deliveryCompany = await this.deliveryCompanyRepo.findById(
      deliveryCompanyId,
    );

    if (!deliveryCompany) return null;

    deliveryCompany.images.forEach((image) => {
      deleteFile(image, 'slides');
    });

    return this.deliveryCompanyRepo.delete(deliveryCompanyId);
  }

  async deleteImage({
    deliveryCompanyId,
    imageName,
  }: {
    deliveryCompanyId: string;
    imageName: string;
  }) {
    deleteFile(imageName, 'slides');

    return await this.findById(deliveryCompanyId);
  }
}
