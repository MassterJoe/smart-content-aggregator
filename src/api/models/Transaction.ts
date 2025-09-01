import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import Wallet from "./Wallet";
import { TransactionType, TransactionStatus } from "../enums/Transaction";

@Entity("transactions")
export default class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user!: User;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet!: Wallet;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  amount!: number;

  @Column()
  description!: string;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus;

  @Column({ unique: true })
  reference!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
