import { createId } from '@paralleldrive/cuid2';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';
import { DeliveryCompany } from './deliveryCompany.entity';

@Entity('delivery_company_images')
export class DeliveryCompanyImage {
  @PrimaryColumn()
  id: string = createId();

  @Column()
  name: string;

  @ManyToOne(
    () => DeliveryCompany,
    (deliveryCompany) => deliveryCompany.images,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'delivery_company_id',
  })
  deliveryCompanyId: DeliveryCompany;
}
