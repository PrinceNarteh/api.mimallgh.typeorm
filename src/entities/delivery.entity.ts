import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { DeliveryCompany } from './deliveryCompany.entity';

@Entity('delivery')
export class Delivery extends Base {
  @Column()
  request: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ nullable: true })
  otherDetails?: string;

  @Column()
  fullName: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  alternatePhoneNumber?: string;

  @Column()
  location: string;

  @Column()
  deliveryCharge: number;

  @Column({
    name: 'date_and_time',
  })
  dateAndTime: string;

  @ManyToOne(
    () => DeliveryCompany,
    (deliveryCompany) => deliveryCompany.deliveries,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'delivery_company_id',
  })
  deliveryCompany: DeliveryCompany;
}
