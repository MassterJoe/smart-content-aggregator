// src/api/repositories/TransactionRepository.ts
import { dataSource } from "../../config/postgres";
import Transaction from "../models/Transaction";
import { TransactionStatus, TransactionType } from "../enums/Transaction";

interface TransactionFilter {
  userId?: string;
  walletId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
}

export const TransactionRepository = dataSource.getRepository(Transaction).extend({
  /**
   * Add a new transaction
   */
  async add(transaction: Partial<Transaction>): Promise<Transaction> {
    return this.save(transaction);
  },

  /**
   * Find by transaction ID
   */
  async findById(id: string): Promise<Transaction | null> {
    if (!id) return null;
    return this.findOne({
      where: { id },
      relations: ["user", "wallet"],
    });
  },

  /**
   * Find transaction by reference
   */
  async findByReference(reference: string): Promise<Transaction | null> {
    if (!reference) return null;
    return this.findOne({
      where: { reference },
      relations: ["user", "wallet"],
    });
  },

  /**
   * Find all transactions by user ID
   */
  async findByUserId(userId: string): Promise<Transaction[]> {
    if (!userId) return [];
    return this.find({
      where: { user: { id: userId } },
      relations: ["user", "wallet"],
      order: { created_at: "DESC" },
    });
  },

  /**
   * List transactions with optional filters
   */
  async list(filter: TransactionFilter = {}): Promise<Transaction[]> {
    const where: any = {};

    if (filter.userId) where.user = { id: filter.userId };
    if (filter.walletId) where.wallet = { id: filter.walletId };
    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;

    return this.find({
      where,
      relations: ["user", "wallet"],
      order: { created_at: "DESC" },
    });
  },

  /**
   * Update transaction by ID
   */
  async updateById(id: string, updates?: Partial<Transaction>): Promise<Transaction | null> {
    if (!updates) return null;

    const transaction = await this.findById(id);
    if (!transaction) return null;

    await this.update({ id }, updates);
    return { ...transaction, ...updates };
  },

  /**
   * Delete transaction by ID
   */
  async deleteById(id: string): Promise<void> {
    await this.delete({ id });
  },
});
