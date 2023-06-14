import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base/baseEntity';
import { DeliveryCompanyImage } from './deliveryCompanyImage.entity';

@Entity('delivery_companies')
export class DeliveryCompany extends Base {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ nullable: true, name: 'alternate_phone_number' })
  alternatePhoneNumber: string;

  @Column({ name: 'whatsapp_number' })
  whatsappNumber: string;

  @OneToMany(
    () => DeliveryCompanyImage,
    (deliveryCompanyImage) => deliveryCompanyImage.deliveryCompanyId,
  )
  images: DeliveryCompanyImage[];

  @BeforeInsert()
  async beforeInsert(): Promise<void> {}
}
