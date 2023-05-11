import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from './base/baseEntity';
import { Shop } from './shop.entity';
import { ProductImage } from './productImage.entity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Review } from './review.entity';

export enum CategoryType {
  food = 'food',
  fashion_and_wears = 'fashion_and_wears',
  grocery_and_general = 'grocery_and_general',
  health_and_wellness = 'health_and_wellness',
  home_and_electrical_appliances = 'home_and_electrical_appliances',
  personal_services = 'personal_services',
  printing_and_stationery = 'printing_and_stationery',
  tech = 'tech',
}

@Entity('products')
export class Product extends Base {
  @Column()
  title: string;

  @Column({
    type: 'longtext',
  })
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  discountPercentage: number;

  @Column({
    default: 0,
  })
  stock: number;

  @Column()
  brand: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  category: string;

  // @Column({
  //   type: 'array',
  //   nullable: true,
  // })
  // rating: number[];

  @OneToMany(() => Review, (review) => review.product, {
    onDelete: 'CASCADE',
  })
  reviews: Review[];

  @OneToMany(() => ProductImage, (productImage) => productImage.productId, {
    onDelete: 'CASCADE',
  })
  images: ProductImage[];

  @ManyToOne(() => Shop, (shop) => shop.products)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;
}
