import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Get,
  Path,
  Security,
} from "tsoa";
import { Inject, Service } from "typedi";
import WalletService from "../services/WalletService";
import { Logger } from "../../lib/logger";
import { CustomApiResponse, errorResponse, successResponse } from "../helpers/responseHandlers";
import { AccountDetails } from "../services/MonnifyService";
import Wallet from "../models/Wallet";
import UserService from "../services/UserService";
import { dataSource } from "src/config/postgres";

export interface FundWalletDTO {
  userId: string;
  amount: number;
}

export interface WithdrawWalletDTO {
  userId: string;
  amount: number;
}

export interface CreateWalletDTO {
  bvn: string;
  bvnDateOfBirth: string; // ISO string (e.g. 1990-04-08)
}

export interface TransferWalletDTO {
  senderId: string;
  receiverId: string;
  amount: number;
}

@Route("wallets")
@Tags("Wallets")
@Security("bearerAuth")
@Service()
export class WalletController extends Controller {
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    
    @Inject(() => Logger) private readonly logger: Logger
  ) {
    super();
  }

/**
   * Create wallet for a user
   */
  @Post("/{userId}")
  @SuccessResponse("201", "Wallet created successfully")
  @Response<CustomApiResponse>("400", "Bad Request")
  public async createWallet(
    @Path() userId: string,
    @Body() payload: Partial<AccountDetails>
  ): Promise<CustomApiResponse<Wallet>> {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
          status_code: 404,
        };
      }

      const wallet = await this.walletService.createWalletForUser(payload, user);
      
      this.setStatus(201);
      return {
        success: true,
        message: "Wallet created successfully",
        status_code: 201,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Wallet creation failed",
        status_code: 400,
      };
    }
  }

  /**
   * Sync wallet details from Monnify and update DB
   */
  @Get("/{walletId}")
  @SuccessResponse("200", "Wallet details retrieved successfully")
  @Response<CustomApiResponse>("404", "Wallet not found")
  public async getAndSyncWalletDetails(
    @Path() walletId: string
  ): Promise<CustomApiResponse<Wallet>> {
    try {
   
      const wallet = await this.walletService.syncWalletFromMonnify(walletId);
      
      if (!wallet) {
        return {
          success: false,
          message: "Wallet not found for this user",
          status_code: 404,
        };
      }
      const sanitizedWallet = () => {
        return {id: wallet.id, wallet_reference: wallet.walletReference, wallet_name: wallet.wallet_name, account_number: wallet.account_number, account_name: wallet.account_name, balance: wallet.balance, total_earned: wallet.total_earned, total_spent: wallet.total_spent, updatedAt: wallet.updatedAt }
      }
      this.setStatus(200);
      return {
        success: true,
        message: "Wallet details retrieved and synced successfully",
        status_code: 200,
        data: sanitizedWallet() as any
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to fetch wallet details",
        status_code: 400,
      };
    }
  }

  /**
   * Get all wallets from Monnify
   */
  @Get("/")
  @SuccessResponse("200", "All wallets retrieved successfully")
  @Response<CustomApiResponse>("400", "Failed to fetch wallets")
  public async getAllWallets(): Promise<CustomApiResponse<Wallet[]>> {
    try {
   
      const wallets = await this.walletService.getAllWallets();

      this.setStatus(200);
      return {
        success: true,
        message: "All wallets retrieved successfully",
        status_code: 200,
        data: wallets as any
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to fetch all wallets",
        status_code: 400,
      };
    }
  }

}
