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
import Service from "./Service";
import { BillPaymentStatus } from "../enums/Airtime"; 

@Entity("bill_payments")
export default class BillPayment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" }) // unique per bill
  transaction!: Transaction;

  @ManyToOne(() => Service)
  @JoinColumn({ name: "service_id" })
  service!: Service;

  @Column()
  customer_id!: string; // e.g. meter number, smartcard number, etc.

  @Column("decimal", { precision: 18, scale: 2 })
  amount!: number;

  @Column({ type: "enum", enum: BillPaymentStatus, default: BillPaymentStatus.PENDING })
  status!: BillPaymentStatus;

  @Index()
  @Column()
  provider_reference!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
