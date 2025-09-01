import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Network from "./Network";

@Entity("exchange_rates")
export default class ExchangeRate {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Network)
  @JoinColumn({ name: "network_id" })
  network!: Network;

  @Column("decimal", { precision: 6, scale: 2 })
  rate!: number; // e.g. 85.50

  @Column("decimal", { precision: 18, scale: 2 })
  min_amount!: number;

  @Column("decimal", { precision: 18, scale: 2 })
  max_amount!: number;

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
