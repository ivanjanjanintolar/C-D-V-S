import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_hash' })
  @Index({ unique: true })
  fileHash: string;

  @Column({ name: 'verified_hash', default: '' })
  verifiedHash?: string;

  @Column({ name: 'file_size' })
  fileSize: string;

  @Column({ name: 'description', default: '' })
  description: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'source_url' })
  sourceUrl: string;

  @Column({ name: 'blockchain_upload_date', default: '' })
  blockchainUploadDate?: string;

  @Column({ name: 'created_at', default: '' })
  createdAt?: string;

  @Column({ name: 'status', default: 'CREATED' })
  status: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;
}
