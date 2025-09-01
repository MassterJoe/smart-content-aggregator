import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import User from "./User";
import Transaction from "./Transaction";

export enum FraudAlertType {
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
  HIGH_VOLUME = "high_volume",
  FAILED_ATTEMPTS = "failed_attempts",
}

export enum FraudSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum FraudStatus {
  OPEN = "open",
  INVESTIGATING = "investigating",
  RESOLVED = "resolved",
}

@Entity("fraud_alerts")
export default class FraudAlert {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Index()
  @ManyToOne(() => Transaction)
  @JoinColumn({ name: "transaction_id" })
  transaction!: Transaction;

  @Column({ type: "enum", enum: FraudAlertType })
  alert_type!: FraudAlertType;

  @Column({ type: "enum", enum: FraudSeverity, default: FraudSeverity.LOW })
  severity!: FraudSeverity;

  @Column({ type: "enum", enum: FraudStatus, default: FraudStatus.OPEN })
  status!: FraudStatus;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
