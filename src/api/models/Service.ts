import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ServiceCategory } from "../enums/Service";

@Entity("services")
export default class Service {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string; // Airtime, Data, etc.

  @Column({ type: "enum", enum: ServiceCategory, default: ServiceCategory.OTHER })
  category!: ServiceCategory;

  @Column()
  provider_name!: string; // e.g. VTU, Paystack, Flutterwave, etc.

  @Column({ default: true })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
