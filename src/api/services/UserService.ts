// services/userService.ts
import { Service, Inject } from "typedi";
import User, { IUser } from "../models/User";
import { AppError } from "../errors/AppError";
import { Logger } from "../../lib/logger";
import { RabbitMQService } from "../queues/rabbitmqService";
import {
  compareHash,
  generateJWT,
  generateRandomString,
  generateUUID,
  hashString,
} from "../helpers/utils";
import { AccountStatus } from "../enums/AccountStatus";
import { env } from "../../env";

@Service()
export default class UserService {
  constructor(
    private readonly rabbitmqService: RabbitMQService,
    @Inject(() => Logger) private readonly logger: Logger
  ) {}

  /**
   * Register new user
   */
  public async registerUser(userData: Partial<IUser>): Promise<IUser> {
    
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new AppError("Email already in use", 400);

        const password_hash = await hashString(userData.password as string);

    
    const otp = generateRandomString({ length: 6, numericOnly: true });
    const { uuid, expiresAt } = generateUUID();

    
    const user = new User({
      ...userData,
      password: password_hash,
      otp,
      email_verification_token: uuid,
      email_verification_expires_at: expiresAt,
      status: AccountStatus.INACTIVE,
    });

    await user.save();

    
    try {
      const verification_link = `${env.app.url}/verify-email?verification_token=${uuid}&otp=${otp}`;
      await this.rabbitmqService.sendRabbitMQMessage("registration", {
        name: user.username,
        otp,
        verification_link,
        email: user.email,
        subject: "Account Activation",
        email_category: "registration",
      });
    } catch (err: any) {
      this.logger.error(
        `[UserService] Failed to queue verification email: ${err.message}`
      );
    }

    return user;
  }

  /**
   * Validate email with OTP + token
   */
  public async validateEmail(otp: string, verification_token: string): Promise<void> {
    const existingUser = await User.findOne({ otp });
    if (!existingUser) throw new AppError("Invalid email or otp", 400);
    if (existingUser.email_verification_token !== verification_token)
      throw new AppError("Invalid verification token", 400);
    if ((existingUser.email_verification_expires_at as Date) < new Date())
      throw new AppError("Verification link has expired", 400);

    existingUser.status = AccountStatus.ACTIVE;
    existingUser.verified_at = new Date();
    existingUser.otp = "";
    existingUser.email_verification_token = "";

    await existingUser.save();
  }

  /**
   * User login
   */
  public async loginUser(email: string, password: string): Promise<string> {
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new AppError("Invalid email or password", 400);

      const isPasswordValid = await compareHash(
        password,
        existingUser.password as string
      );
      if (!isPasswordValid) throw new AppError("Invalid email or password", 400);

      if (existingUser.status !== AccountStatus.ACTIVE)
        throw new AppError("Please verify your email before logging in", 403);

      existingUser.last_login = new Date();
      await existingUser.save();

      return generateJWT(existingUser.email, existingUser.id);
    } catch (error: any) {
      this.logger.error("Error in loginUser:", error);
      throw new AppError("Invalid Email or password", 500);
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId).populate("bookmarks");
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  /**
   * Get user by email
   */
  public async getUserByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  /**
   * List users with optional pagination and search
   */
  public async listUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return { data: users, total, page, limit };
  }

  /**
   * Update user
   */
  public async updateUser(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    Object.assign(user, data);
    await user.save();

    return user;
  }

  /**
   * Delete user
   */

  public async deleteUser(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    await user.deleteOne();
  }
}
