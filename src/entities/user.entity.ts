import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Base } from './base/baseEntity';
import { Order } from './order.entity';
import { Review } from './review.entity';

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

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  banner: string;

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

  @OneToMany(() => Order, (order) => order.user, {
    onDelete: 'CASCADE',
  })
  orders: Order[];

  @ManyToOne(() => Review, (review) => review.user, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }
}
