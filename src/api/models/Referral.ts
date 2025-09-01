import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";
import { ReferralStatus } from "../enums/User";

@Entity("referrals")
export default class Referral {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "referrer_id" })
  referrer!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "referred_id" })
  referred!: User;

  @Column("decimal", { precision: 18, scale: 2, default: 0.0 })
  bonus_amount!: number;

  @Column({ type: "enum", enum: ReferralStatus, default: ReferralStatus.PENDING })
  status!: ReferralStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
