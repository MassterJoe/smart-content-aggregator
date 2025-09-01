import { dataSource } from "../../config/postgres";
import Wallet from "../models/Wallet";

export const WalletRepository = dataSource.getRepository(Wallet).extend({
  async add(wallet: Partial<Wallet>): Promise<Wallet> {
    return this.save(wallet);
  },

  async findById(id: string): Promise<Wallet | null> {
    if (!id) return null;
    return this.findOne({ where: { id }, relations: ["user"] });
  },

  async findByUserId(user_id: string): Promise<Wallet | null> {
    if (!user_id) return null;
    return this.findOne({
      where: { user: { id: user_id } },
      relations: ["user"],
    });
  },

  async list(filter: any = {}): Promise<Wallet[]> {
    return this.find({ ...filter, relations: ["user"] });
  },

  async updateByWallet(wallet: Wallet, updates?: Partial<Wallet>): Promise<Wallet | null> {
    if (!updates) return null;
    await this.update({ id: wallet.id }, updates);
    return { ...wallet, ...updates } as Wallet;
  },

  async updateById(id: string, updates?: Partial<Wallet>): Promise<Wallet | null> {
    if (!updates) return null;
    const wallet = await this.findById(id);
    if (!wallet) return null;

    await this.update({ id }, updates);
    return { ...wallet, ...updates };
  },

  async deleteById(id: string): Promise<void> {
    await this.delete({ id });
  },
});
