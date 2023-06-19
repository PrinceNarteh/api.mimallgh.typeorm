import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryCompany } from 'src/entities/deliveryCompany.entity';
import { Repository } from 'typeorm';
import { CreateDeliveryCompanyDto } from './dto/delivery-company.dto';
import { DeliveryCompanyImage } from 'src/entities/deliveryCompanyImage.entity';
import { deleteFile } from 'src/utils/deleteFile';

@Injectable()
export class DeliveryCompaniesService {
  constructor(
    @InjectRepository(DeliveryCompany)
    private readonly deliveryCompanyRepo: Repository<DeliveryCompany>,
    @InjectRepository(DeliveryCompanyImage)
    private readonly deliveryCompanyImgRepo: Repository<DeliveryCompanyImage>,
  ) {}

  async findAll() {
    return this.deliveryCompanyRepo.find({
      relations: ['images'],
    });
  }

  async findOne(id: string) {
    return this.deliveryCompanyRepo.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async findOneBySlug(slug: string) {
    return this.deliveryCompanyRepo.findOne({
      where: { slug },
      relations: ['images'],
    });
  }

  async create(
    createProductDto: CreateDeliveryCompanyDto,
    imageNames: Array<string>,
  ) {
    const imagesArr: DeliveryCompanyImage[] = [];
    for (let image of imageNames) {
      const res = this.deliveryCompanyImgRepo.create({ name: image });
      await this.deliveryCompanyImgRepo.save(res);
      imagesArr.push(res);
    }

    const product = this.deliveryCompanyRepo.create({
      ...createProductDto,
      images: imagesArr,
    });

    await this.deliveryCompanyRepo.save(product);

    return product;
  }

  async update(
    deliveryCompanyId: string,
    updateDeliveryCompanyDto: Partial<CreateDeliveryCompanyDto>,
    imageNames?: Array<string>,
  ) {
    const deliveryCompany = await this.deliveryCompanyRepo.findOne({
      where: { id: deliveryCompanyId },
      relations: {
        images: true,
      },
    });
    if (!deliveryCompany) {
      throw new NotFoundException('Product not found');
    }
    const imagesArr: DeliveryCompanyImage[] = [];
    let data: any;

    if (imageNames) {
      for (let image of imageNames) {
        const res = this.deliveryCompanyImgRepo.create({ name: image });
        await this.deliveryCompanyImgRepo.save(res);
        imagesArr.push(res);
      }
    }

    if (updateDeliveryCompanyDto.images) {
      const images = JSON.parse(updateDeliveryCompanyDto.images as any);

      data = {
        ...updateDeliveryCompanyDto,
        images: [...images, ...imagesArr],
      };
    } else {
      data = {
        ...updateDeliveryCompanyDto,
        images: [...deliveryCompany.images, ...imagesArr],
      };
    }

    const updatedProduct = Object.assign(deliveryCompany, data);
    await updatedProduct.save();

    return updatedProduct;
  }

  async delete(deliveryCompanyId: string) {
    const deliveryCompany = await this.deliveryCompanyRepo.findOne({
      where: { id: deliveryCompanyId },
      relations: ['images'],
    });

    if (!deliveryCompany) return null;

    await this.deliveryCompanyImgRepo.delete({
      deliveryCompanyId: {
        id: deliveryCompanyId,
      },
    });

    deliveryCompany.images.forEach((image) => {
      deleteFile(image.name, 'slides');
    });

    await this.deliveryCompanyRepo.delete(deliveryCompanyId);

    return 'Product deleted successfully';
  }

  async findImage(imageId: string) {
    const img = this.deliveryCompanyImgRepo.findOne({ where: { id: imageId } });

    if (!img) {
      throw new NotFoundException('Product Image Not Found');
    }

    return img;
  }

  async deleteImage({
    deliveryCompanyId, 
    imageId,
  }: {
    deliveryCompanyId: string;
    imageId: string;
  }) {
    const img = await this.findImage(imageId);
    await this.deliveryCompanyImgRepo.delete({ id: imageId });

    if (img) deleteFile(img.name, 'slides');

    return await this.findOne(deliveryCompanyId);
  }
}
