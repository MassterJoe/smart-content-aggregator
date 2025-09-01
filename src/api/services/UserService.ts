import { Service, Inject } from "typedi";
import { dataSource } from "../../config/postgres";
import { EntityManager } from "typeorm";
import User from "../models/User";
import Wallet from "../models/Wallet";
import WalletService from "./WalletService";
import { AppError } from "../errors/AppError";
import { Logger } from "../../lib/logger";
import { RabbitMQService } from "../queues/rabbitmqService";
import {
  compareHash,
  generateJWT,
  generateRandomString,
  generateUUID,
  hashString
} from "../helpers/utils";
import { UserRepository } from "../repositories/UserRepository";
import { AccountStatus } from "../enums/AccountStatus";
import { env } from "../../env";
import { EmailVerificationDTO } from "../dtos/UserDTO";

@Service()
export default class UserService {
  constructor(
    private readonly walletService: WalletService,
    private readonly rabbitmqService: RabbitMQService,
    @Inject(() => Logger) private readonly logger: Logger
  ) {}

   /**
   * Register a new user (without creating a wallet)
   */
  public async registerUser(userData: Partial<User>): Promise<User> {
    return await dataSource.transaction(async (manager) => {
      // Check if email exists
      const existingUser = await manager.findOne(User, { where: { email: userData.email } });
      if (existingUser) throw new AppError("User already exists", 400);

      // Hash password
      const password_hash = await hashString(userData.password as string);

      // Generate OTP and verification token
      const otp = generateRandomString({ length: 6, numericOnly: true });
      const { uuid, expiresAt } = generateUUID();

      // Create user
      const user = manager.create(User, {
        ...userData,
        password: password_hash,
        otp,
        email_verification_token: uuid,
        email_verification_expires_at: expiresAt,
        status: AccountStatus.INACTIVE,
      });

      await manager.save(user);

      // Queue verification email
      try {
        const verification_link = `${env.app.url}/verify-email?verification_token=${uuid}&otp=${otp}`;
        await this.rabbitmqService.sendRabbitMQMessage("registration", {
          name: user.first_name,
          otp,
          verification_link,
          email: user.email,
          subject: "Account Activation",
          email_category: "registration",
        });
      } catch (err: any) {
        this.logger.error(`[UserService] Failed to queue verification email: ${err.message}`);
      }

      return user;
    });
  }

  /**
   * Validate email with OTP + token
   */
  public async validateEmail(req: EmailVerificationDTO): Promise<void> {
    const { otp, verification_token } = req;
    const existingUser = await UserRepository.findUserByOtp(otp as string);
    if (!existingUser) throw new AppError("Invalid email or otp", 400);
    if (existingUser.email_verification_token !== verification_token)
      throw new AppError("Invalid verification token", 400);
    if ((existingUser.email_verification_expires_at as Date) < new Date())
      throw new AppError("Verification link has expired", 400);

    existingUser.status = AccountStatus.ACTIVE;
    existingUser.verified_at = new Date();
    existingUser.otp = "";
    existingUser.email_verification_token = "";

    await UserRepository.save(existingUser);
  }

  /**
   * User login
   */
  public async loginUser(email: string, password: string): Promise<string> {
    try {
      const existingUser = await UserRepository.findByEmail(email);
      if (!existingUser) throw new AppError("Invalid email or password", 400);

      const isPasswordValid = await compareHash(password, existingUser.password as string);
      if (!isPasswordValid) throw new AppError("Invalid email or password", 400);

      if (existingUser.status !== AccountStatus.ACTIVE)
        throw new AppError("Please verify your email before logging in", 403);

      existingUser.last_login = new Date();
      await UserRepository.save(existingUser);

      return generateJWT(existingUser.email, existingUser.id);
    } catch (error) {
      this.logger.error("Error in loginUser:", error);
      throw new AppError("Invalid Email or password", 500);
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: string): Promise<any> {
    const user = await UserRepository.findOne({ where: { id: userId }, relations: ["wallet"] });
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  /**
   * Get user by email
   */
  public async getUserByEmail(email: string): Promise<any> {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  /**
   * List users with optional pagination and search
   */
  public async listUsers(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const query = UserRepository.createQueryBuilder("user").leftJoinAndSelect("user.wallet", "wallet");
    if (search) {
      query.where("user.email ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search", {
        search: `%${search}%`,
      });
    }
    query.skip(skip).take(limit).orderBy("user.created_at", "DESC");
    const [users, total] = await query.getManyAndCount();
    return { data: users.map((u) => (u)), total, page, limit };
  }

  public async updateUser(userId: string, data: Partial<User>): Promise<any> {
    const user = await UserRepository.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    Object.assign(user, data);
    await UserRepository.save(user);
    return user;
  }

  public async deleteUser(userId: string): Promise<void> {
    const user = await UserRepository.findOne({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    await UserRepository.remove(user);
  }
}
