import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("networks")
export default class Network {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string; // MTN, Airtel, etc.

  @Index({ unique: true })
  @Column()
  code!: string; // e.g. "mtn", "airtel"

  @Column({ nullable: true })
  logo_url?: string;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
