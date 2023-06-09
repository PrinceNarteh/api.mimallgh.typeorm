import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base/baseEntity';
import { DeliveryCompanyImage } from './deliveryCompanyImage.entity';
import slugify from 'slugify';
import { Delivery } from './delivery.entity';
import { QuickOrder } from './quickOrder.entity';

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

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => Delivery, (delivery) => delivery.deliveryCompany)
  deliveries: Delivery[];

  @OneToMany(() => QuickOrder, (quickOrder) => quickOrder.deliveryCompany)
  quickOrders: QuickOrder[];

  @OneToMany(
    () => DeliveryCompanyImage,
    (deliveryCompanyImage) => deliveryCompanyImage.deliveryCompanyId,
  )
  images: DeliveryCompanyImage[];

  @BeforeInsert()
  @BeforeUpdate()
  async beforeInsert(): Promise<void> {
    // slugify title
    this.slug = slugify(this.name, { remove: /[*+~.()'"!:@]/g, lower: true });
  }
}
