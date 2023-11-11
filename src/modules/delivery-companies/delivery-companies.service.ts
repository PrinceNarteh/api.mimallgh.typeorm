import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { deleteFile } from 'src/utils/deleteFile';
import { DeliveryCompanyRepository } from './delivery-companies.repository';
import { CreateDeliveryCompanyDto } from './dto/delivery-company.dto';
import { DeliveryCompanyDocument } from './schema/delivery-company.schema';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from 'src/common/login-dto';
import bcrypt from 'bcrypt';
import { LoginResponseType } from 'src/custom-types';
import { generateToken } from 'src/common/generate-token';

@Injectable()
export class DeliveryCompaniesService {
  constructor(
    private readonly deliveryCompanyRepo: DeliveryCompanyRepository,
    private readonly rolesService: RolesService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<LoginResponseType<DeliveryCompanyDocument>> {
    const deliveryCompany = await this.deliveryCompanyRepo.findOne({
      email: loginDto.email,
    });

    if (
      !deliveryCompany ||
      !bcrypt.compare(deliveryCompany.password, loginDto.password)
    ) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = generateToken(deliveryCompany);

    return {
      token,
      data: deliveryCompany,
    };
  }

  async getAllDeliveryCompanies(): Promise<DeliveryCompanyDocument[]> {
    return this.deliveryCompanyRepo.find({});
  }

  async getDeliveryCompany(
    id: string,
  ): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyRepo.findById(id);
  }

  async getDeliveryCompanyBySlug(
    slug: string,
  ): Promise<DeliveryCompanyDocument | null> {
    return this.deliveryCompanyRepo.findOneBySlug(slug);
  }

  async createDeliveryCompany(
    createDeliveryCompanyDto: CreateDeliveryCompanyDto,
    logo: string,
    slide_images: Array<string>,
  ): Promise<DeliveryCompanyDocument> {
    const emailExists = await this.deliveryCompanyRepo.findOne({
      email: createDeliveryCompanyDto.email,
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    const roles = await this.rolesService.getRole({ name: 'Delivery Company' });
    return this.deliveryCompanyRepo.create({
      ...createDeliveryCompanyDto,
      logo,
      slide_images,
    });
  }

  async updateDeliveryCompany(
    deliveryCompanyId: string,
    updateDeliveryCompanyDto: Partial<CreateDeliveryCompanyDto>,
    imageNames?: Array<string>,
  ): Promise<DeliveryCompanyDocument | null> {
    const deliveryCompany = await this.deliveryCompanyRepo.findById(
      deliveryCompanyId,
    );
    if (!deliveryCompany) {
      throw new NotFoundException('delivery company not found');
    }

    return this.deliveryCompanyRepo.findByIdAndUpdate(deliveryCompanyId, {
      ...updateDeliveryCompanyDto,
      ...(imageNames?.length > 0 && {
        images: [...deliveryCompany.slide_images, ...imageNames],
      }),
    });
  }

  async deleteDeliveryCompany(
    deliveryCompanyId: string,
  ): Promise<DeliveryCompanyDocument | null> {
    const deliveryCompany = await this.deliveryCompanyRepo.findById(
      deliveryCompanyId,
    );

    if (!deliveryCompany) return null;

    deliveryCompany.slide_images.forEach((image) => {
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

    return await this.getDeliveryCompany(deliveryCompanyId);
  }
}
