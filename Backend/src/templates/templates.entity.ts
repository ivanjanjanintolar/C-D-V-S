import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'templates' })
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'template_name' })
  name: string;

  @Column({ name: 'x' })
  x: string;

  @Column({ name: 'y' })
  y: string;

  @Column({ name: 'width' })
  width: string;

  @Column({ name: 'height' })
  height: string;

  @Column({ name: 'scaled_width' })
  scaledWidth: string;

  @Column({ name: 'scaled_height' })
  scaledHeight: string;
}
