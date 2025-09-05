import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  Column,
  Index,
} from 'typeorm';

import { DecimalTransformer } from '@modules/products/transformers';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  @Index({ unique: true })
  externalId: string;

  @Column()
  publishedVersion: number;

  @Column()
  revision: number;

  @Column({ length: 128 })
  @Index({ unique: true })
  sku: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 128 })
  brand: string;

  @Column({ length: 128 })
  model: string;

  @Column({ length: 128 })
  category: string;

  @Column({ length: 128 })
  color: string;

  @Column({
    transformer: new DecimalTransformer(),
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  price: number;

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'int' })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  fetchedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;
}
