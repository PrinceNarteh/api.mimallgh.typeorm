import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseImage } from './base/baseImageEntity';
import { User } from './user.entity';

@Entity('user_images')
export class UserImage extends BaseImage {
  @OneToOne(() => User, (user) => user.image)
  @JoinColumn({
    name: 'user_id',
  })
  userId: User;
}
