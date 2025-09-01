import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import Wallet from "./Wallet";
import Transaction from "./Transaction";
import { AccountStatus } from "../enums/AccountStatus";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  password_reset_token?: string;

  @Column({ nullable: true })
  password_reset_expires_at?: Date;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  bvn?: string;

  @Column({ nullable: true })
  bvn_dob?: string;

  @Column({ nullable: true })
  otp?: string;

  @Column({ nullable: true })
  email_verification_token?: string;

  @Column({ type: "timestamp", nullable: true })
  email_verification_expires_at?: Date;

  @Column({ type: "timestamp", nullable: true })
  verified_at?: Date;

  @Column({
    type: "enum",
    enum: AccountStatus,
    default: AccountStatus.INACTIVE,
  })
  status!: AccountStatus;

  @Column({ type: "timestamp", nullable: true })
  last_login?: Date;

  /**
   * Optional wallet: user may not have a wallet initially
   */
  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true, nullable: true })
  @JoinColumn()
  wallet?: Wallet;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
