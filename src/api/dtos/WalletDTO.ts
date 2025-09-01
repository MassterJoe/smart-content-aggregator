import { IsUUID, IsNumber, Min } from "class-validator";

/**
 * Fund wallet DTO
 */
export class FundWalletDto {
  @IsUUID()
  userId!: string;

  @IsNumber()
  @Min(1, { message: "Amount must be greater than 0" })
  amount!: number;
}

/**
 * Withdraw wallet DTO
 */
export class WithdrawWalletDto {
  @IsUUID()
  userId!: string;

  @IsNumber()
  @Min(1, { message: "Amount must be greater than 0" })
  amount!: number;
}

/**
 * Transfer wallet DTO
 */
export class TransferWalletDto {
  @IsUUID()
  senderId!: string;

  @IsUUID()
  receiverId!: string;

  @IsNumber()
  @Min(1, { message: "Amount must be greater than 0" })
  amount!: number;
}
