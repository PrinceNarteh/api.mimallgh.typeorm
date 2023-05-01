import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseImage } from './base/baseImageEntity';
import { Shop } from './shop.entity';

@Entity('shop_images')
export class ShopImage extends BaseImage {
  @OneToOne(() => Shop, (shop) => shop.image)
  @JoinColumn({
    name: 'shop_id',
  })
  shopId: Shop;
}
