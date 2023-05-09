import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';
import { UserImage } from './userImage.entity';

export type UserRole = 'admin' | 'user';

export type UserLevel =
  | 'level_one'
  | 'level_two'
  | 'level_three'
  | 'super_user';

@Entity('users')
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    nullable: true,
  })
  middleName: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true,
  })
  alternateNumber: string;

  @Column({
    nullable: true,
  })
  nationality: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserImage, (userImage) => userImage.userId)
  image: UserImage;

  @Column({
    nullable: true,
  })
  cardType: string;

  @Column({
    nullable: true,
  })
  cardNumber: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['level_one', 'level_two', 'level_three', 'super_user'],
    nullable: true,
    default: 'level_one',
  })
  level: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
