import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base/baseEntity';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('reviews')
export class Review extends Base {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
}
