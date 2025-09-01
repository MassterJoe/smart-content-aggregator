import axios from "axios";
import { Service } from "typedi";
import { env } from "../../env";
import { generateUUID } from "../helpers/utils";
const { MonnifyAPI } = require('monnify-nodejs-lib');
import User from "../models/User";
import Wallet from "../models/Wallet";

const config = {
  MONNIFY_APIKEY: env.monnify.apiKey,
  MONNIFY_SECRET: env.monnify.clientSecret,
  env: env.monnify.env
};

const monnify = new MonnifyAPI(config);

interface  BVNDetails {
        bvn: string,
        bvnDateOfBirth: string
      }

export interface AccountDetails {
      accountReference: string,
      accountName: string,
      currencyCode: string,
      contractCode: string,
      customerEmail: string,
      customerName: string,
     bvnDetails: BVNDetails,
     nin?: string, 
}

@Service()
export default class MonnifyService {
constructor(

) {}
  
  public async createReservedAccount(payload: Partial<AccountDetails>, user: Partial<User>): Promise<any> {
  try {
    const accountReference = `ref-${generateUUID().uuid}`;

    const AccountDetails = {
      accountReference,
      accountName: `${user.first_name} ${user.last_name} - ${accountReference}`,
      currencyCode: "NGN",
      contractCode: env.monnify.contractCode,
      customerEmail: user.email,
      customerName: `${user.first_name} ${user.last_name}`,
      bvn: payload.bvnDetails?.bvn ?? user.bvn,
      "getAllAvailableBanks": true,
      nin: payload.nin? payload.nin : "",
    };

    const authToken = await monnify.getToken();

    const response = await monnify.post(
      "/api/v2/bank-transfer/reserved-accounts",
      authToken[1],
      AccountDetails
    );

    return response;
  } catch (error: any) {
    const errMsg = error.response?.data ?? error.message;
    console.error("Error creating reserved account:", errMsg);
    throw new Error(`Reserved account creation failed: ${errMsg}`);

  }

  }

  public async createDisbursementWallet(payload: Partial<AccountDetails>, user: Partial<User>): Promise<any> {
  try {
    const walletReference = `ref-${generateUUID().uuid}`;

    const AccountDetails = {
      walletReference,
      walletName: `${user.first_name} - ${walletReference}`,
      customerName: `${user.first_name} ${user.last_name}`,
            bvnDetails: {
      bvn: payload.bvnDetails?.bvn ?? user.bvn,
      bvnDateOfBirth: payload.bvnDetails?.bvnDateOfBirth ?? user.bvn_dob,
      },
      customerEmail: user.email
    };

    const authToken = await monnify.getToken();

    const response = await monnify.post(
      "/api/v1/disbursements/wallet",
      authToken[1],
      AccountDetails
    );

    return response;
  } catch (error: any) {
    const errMsg = error.response?.data ?? error.message;
    console.error("Error creating disbursement wallet:", errMsg);
    throw new Error(`Disbursement wallet creation failed: ${errMsg}`);
  }
}


  public async getWalletDetails(query: { accountNumber?: string }): Promise<any> {
  try {
    const authToken = await monnify.getToken();

     const response = await monnify.get(
      `/api/v1/disbursements/wallet/balance?accountNumber=${query.accountNumber}`,
      authToken[1]
    );

    return response;
  } catch (error: any) {
    const errMsg = error.response?.data ?? error.message;
    console.error("Error fetching wallet details:", errMsg);
    throw new Error(`Fetching wallet details failed: ${errMsg}`);
  }
}

  public async getAllWallets(): Promise<any> {
    try {
        const authToken = await monnify.getToken();

        const response = await monnify.get(
        `/api/v1/disbursements/wallet`,authToken[1]
        ); 
        return response;
    }
    catch (error: any) {
      const errMsg = error.response?.data ?? error.message;
      console.error("Error fetching all wallets:", errMsg);
      throw new Error(`Fetching all wallets failed: ${errMsg}`);
    }
  }
}
