// src/api/dtos/TransactionDTO.ts
import { IsUUID, IsEnum, IsNumber, IsOptional, Min, IsString } from "class-validator";
import { TransactionType, TransactionStatus } from "../enums/Transaction";

export class CreateTransactionDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  walletId!: string;

  @IsEnum(TransactionType, { message: "Transaction type must be FUND, WITHDRAW, or TRANSFER" })
  type!: TransactionType;

  @IsNumber()
  @Min(1, { message: "Amount must be greater than 0" })
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class TransactionResponseDto {
  id!: string;
  userId!: string;
  walletId!: string;
  type!: TransactionType;
  amount!: number;
  description?: string;
  status!: TransactionStatus;
  reference!: string;
  createdAt!: Date;
}
