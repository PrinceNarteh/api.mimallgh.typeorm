import { Column } from 'typeorm';
import { Base } from './base/baseEntity';
import { DeliveryCompanyImage } from './deliveryCompanyImage.entity';

export class DeliveryCompany extends Base {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  phoneNumber: string;

  @Column()
  alternatePhoneNumber: string;

  @Column()
  whatsappNumber: string;

  @Column()
  images: DeliveryCompanyImage[];
}
