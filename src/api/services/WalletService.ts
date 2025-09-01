import { Service } from "typedi";
import { dataSource } from "../../config/postgres";
import { EntityManager } from "typeorm";
import Wallet from "../models/Wallet";
import User from "../models/User";
import Transaction from "../models/Transaction";
import { AppError } from "../errors/AppError";
import { TransactionStatus, TransactionType } from "../enums/Transaction";
import { v4 as uuidv4 } from "uuid";
import MonnifyService, {AccountDetails} from "./MonnifyService";
import { generateUUID } from "../helpers/utils";
import { Logger } from "../../lib/logger";
import { WalletRepository } from "../repositories/WalletRepository";
import { UserRepository } from "../repositories/UserRepository";
@Service()
export default class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly monnifyService: MonnifyService,
     private walletRepository = WalletRepository,
     private userRepository = UserRepository
  ) {}

  
    
 /**
   * Create wallet for an existing user
   */
  public async createWalletForUser(
    payload: Partial<AccountDetails>,
    user: Partial<User>
  ): Promise<Wallet> {
  
      const monnifyWallet = await this.monnifyService.createDisbursementWallet(
        {...payload},
        user
      );
     
      const walletBody = monnifyWallet[1].responseBody

      if (!monnifyWallet[1].requestSuccessful) {
        throw new AppError(
          `Wallet creation failed: ${monnifyWallet.responseMessage}`,
          400
        );
      }
      
      const wallet = this.walletRepository.create({
        user, 
        wallet_reference: walletBody.walletReference,
        wallet_name: walletBody.walletName,
        account_number: walletBody.accountNumber,
        account_name: walletBody.accountName,
        top_up_account_details:{
          accountNumber: walletBody.topUpAccountDetails.accountNumber,
          accountName: walletBody.topUpAccountDetails.accountName,
          bankCode: walletBody.topUpAccountDetails.bankCode,
          bankName: walletBody.topUpAccountDetails.bankName,
          createdOn: new Date().toISOString(),
        },
        customer_email: walletBody.customerEmail,
        bvn: walletBody.bvnDetails?.bvn,
        bvn_dob: walletBody.bvnDetails?.bvnDateOfBirth,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
      });

      await this.walletRepository.save(wallet); 
      await this.userRepository.updateById(user.id as string, { wallet });
    

      return wallet;
    
  }
  
   /**
   * Sync wallet details from Monnify for a specific user
   */

   public async syncWalletFromMonnify(id: string): Promise<any> {
   
    try { 
      const wallet = await this.walletRepository.findById(id);
       
      if (!wallet) throw new Error("Wallet not found");

      
      const response = await this.monnifyService.getWalletDetails({
        accountNumber: wallet.account_number,
      }); 
      
      if (response[1].responseBody.availableBalance !== wallet.balance) {
        const updatedWallet = await this.walletRepository.updateById(wallet.id, {
          balance: response[1].responseBody.availableBalance,
        });
        
        return updatedWallet;
      }
         

    } catch (error: any) {
      console.error("❌ Error syncing wallet:", error);
      throw new Error(error.message || "Failed to sync wallet");
    }
  }

  public async getAllWallets(): Promise<any> {
    try {
       const response = await this.monnifyService.getAllWallets();
       
      return response[1].responseBody.content;
    } catch (error: any) {
      console.error("❌ Error fetching all wallets:", error);
      throw new Error(error.message || "Failed to fetch all wallets");
    }  

  }
}