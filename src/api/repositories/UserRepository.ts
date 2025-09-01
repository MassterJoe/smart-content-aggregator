import { dataSource } from "../../config/postgres";
import User from "../models/User";

export const UserRepository = dataSource.getRepository(User).extend({
  async add(user: Partial<User>): Promise<User> {
    return this.save(user);
  },

  async findById(id: string): Promise<User | null> {
    if (!id) return null;
    return this.findOne({ where: { id }, relations: ["wallet"] }); // eager load wallet if needed
  },

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email }, relations: ["wallet"] });
  },

  async findByPasswordResetToken(password_reset_token: string): Promise<User | null> {
    return this.findOne({ where: { password_reset_token } });
  },

  async findUserByOtp(otp: string): Promise<User | null> {
    return this.findOne({ where: { otp } });
  },

  async list(filter: any = {}): Promise<User[]> {
    return this.find({ ...filter, relations: ["wallet"] });
  },

  async updateByUser(user: User, updates?: Partial<User>): Promise<User | null> {
    if (!updates) return null;
    await this.update({ id: user.id }, updates);
    return { ...user, ...updates } as User;
  },

  async updateById(id: string, updates?: Partial<User>): Promise<User | null> {
    if (!updates) return null;
    const user = await this.findById(id);
    if (!user) return null;

    await this.update({ id }, updates);
    return { ...user, ...updates };
  },

  async deleteById(id: string): Promise<void> {
    await this.delete({ id });
  },

  findUserByResetToken(password_reset_token: string) {
    return this.findOne({
      where: { password_reset_token }, 
    });
  }
});
