// src/api/controllers/TransactionController.ts
import {
  Controller,
  Get,
  Path,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Security,
} from "tsoa";
import { Inject, Service } from "typedi";
import { Logger } from "../../lib/logger";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { TransactionType, TransactionStatus } from "../enums/Transaction";
import {
  CustomApiResponse,
  successResponse,
  errorResponse,
} from "../helpers/responseHandlers";

@Route("transactions")
@Security("bearerAuth")
@Tags("Transactions")
@Service()
export class TransactionController extends Controller {
  constructor(
    @Inject(() => Logger) private readonly logger: Logger
  ) {
    super();
  }

  /**
   * Get a transaction by ID
   */
  @Get("/{id}")
  @Security("bearerAuth")
  @SuccessResponse("200", "Transaction retrieved successfully")
  @Response<CustomApiResponse>("404", "Transaction not found")
  public async getTransactionById(
    @Path() id: string
  ): Promise<CustomApiResponse> {
    try {
      const transaction = await TransactionRepository.findById(id);
      if (!transaction) {
        return errorResponse("Transaction not found", 404);
      }
      return successResponse("Transaction retrieved successfully", 200, transaction);
    } catch (error: any) {
      this.logger.error("Get transaction failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * Get a transaction by reference
   */
  @Get("/reference/{reference}")
  @Security("bearerAuth")
  @SuccessResponse("200", "Transaction retrieved successfully")
  @Response<CustomApiResponse>("404", "Transaction not found")
  public async getTransactionByReference(
    @Path() reference: string
  ): Promise<CustomApiResponse> {
    try {
      const transaction = await TransactionRepository.findByReference(reference);
      if (!transaction) {
        return errorResponse("Transaction not found", 404);
      }
      return successResponse("Transaction retrieved successfully", 200, transaction);
    } catch (error: any) {
      this.logger.error("Get transaction by reference failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * List transactions with optional filters
   */
  @Get("/")
  @Security("bearerAuth")
  @SuccessResponse("200", "Transactions listed successfully")
  public async listTransactions(
    @Query() userId?: string,
    @Query() walletId?: string,
    @Query() type?: TransactionType,
    @Query() status?: TransactionStatus
  ): Promise<CustomApiResponse> {
    try {
      const transactions = await TransactionRepository.list({
        userId,
        walletId,
        type,
        status,
      });
      return successResponse("Transactions listed successfully", 200, transactions);
    } catch (error: any) {
      this.logger.error("List transactions failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * Get all transactions for a user
   */
  @Get("/user/{userId}")
  @Security("bearerAuth")
  @SuccessResponse("200", "User transactions retrieved successfully")
  public async getUserTransactions(
    @Path() userId: string
  ): Promise<CustomApiResponse> {
    try {
      const transactions = await TransactionRepository.findByUserId(userId);
      return successResponse("User transactions retrieved successfully", 200, transactions);
    } catch (error: any) {
      this.logger.error("Get user transactions failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }
}
