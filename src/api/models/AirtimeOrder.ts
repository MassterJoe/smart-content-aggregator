import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import User from "./User";
import Transaction from "./Transaction";
import Network from "./Network";
import { AirtimeOrderStatus } from "../enums/Airtime";

@Entity("airtime_orders")
export default class AirtimeOrder {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" }) // unique per order
  transaction!: Transaction;

  @ManyToOne(() => Network)
  @JoinColumn({ name: "network_id" })
  network!: Network;

  @Column()
  phone_number!: string;

  @Column("decimal", { precision: 18, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: AirtimeOrderStatus, default: AirtimeOrderStatus.PENDING })
  status!: AirtimeOrderStatus;

  @Index()
  @Column()
  provider_reference!: string; // reference from provider (e.g. VTU vendor)

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
