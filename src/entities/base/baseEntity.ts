import { createId } from '@paralleldrive/cuid2';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Base extends BaseEntity {
  @PrimaryColumn()
  id: string = createId();

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
