import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Base } from './base/baseEntity';
import { Shop } from './shop.entity';
import { ColumnNumericTransformer } from './base/columnNumericTransformer';
import { Review } from './review.entity';
import { createId } from '@paralleldrive/cuid2';

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

@Entity('product_images')
export class ProductImage {
  @PrimaryColumn()
  id: string = createId();

  @Column()
  name: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id',
  })
  productId: Product;
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
    cascade: true,
    eager: true,
  })
  images: ProductImage[];

  @ManyToOne(() => Shop, (shop) => shop.products)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;
}
