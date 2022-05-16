import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username' })
  @Index({ unique: true })
  username: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'repeatPassword' })
  repeatPassword: string;

  @Column({ name: 'email' })
  email: string;
}
