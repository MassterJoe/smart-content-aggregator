import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import Transaction from "./Transaction";

@Entity("wallets")
export default class Wallet {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  wallet_reference?: string;

  @Column()
  wallet_name?: string;

  @Column()
  account_number?: string;

  @Column()
  account_name?: string;

   @Column({ type: "jsonb", nullable: true })
  top_up_account_details?: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
    createdOn: string;
  };

  @Column()
  customer_email?: string;

  @Column({ nullable: true })
  bvn?: string;

  @Column({ nullable: true })
  bvn_dob?: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  balance?: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  total_earned?: number;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0 })
  total_spent?: number;

  /**
   * Link to a user: optional initially, user may not have a wallet
   */
  @OneToOne(() => User, (user) => user.wallet, { onDelete: "CASCADE", nullable: true })
  @JoinColumn()
  user?: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions!: Transaction[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
