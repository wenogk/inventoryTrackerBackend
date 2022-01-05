import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum Categories {
  TECHNOLOGY = "TECHNOLOGY",
  KITCHEN = "KITCHEN",
  PET = "PET",
  HOME = "HOME",
  EDUCATION = "EDUCATION",
  GENERAL = "GENERAL"
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  sku: string;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: Categories  ,
    default: Categories.GENERAL
  })
  role: Categories;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
