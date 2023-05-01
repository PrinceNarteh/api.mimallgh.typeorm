import { createId } from '@paralleldrive/cuid2';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class BaseImage extends BaseEntity {
  @PrimaryColumn()
  id: string = createId();

  @Column()
  public_id: string;

  @Column()
  secure_url: string;
}
