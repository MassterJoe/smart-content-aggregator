import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";
import { AdminRole } from "../enums/User";

@Entity("admin_users")
export default class AdminUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ type: "enum", enum: AdminRole, default: AdminRole.SUPPORT })
  role!: AdminRole;

  @Column({ type: "jsonb", nullable: true })
  permissions?: object; // flexible RBAC

  @Column({ type: "timestamp", nullable: true })
  last_login?: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
