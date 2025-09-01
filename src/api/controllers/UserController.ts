import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Get,
  Put,
  Path,
  Query,
  Delete,
  Security,
} from "tsoa";
import { Inject, Service } from "typedi";
import UserService from "../services/UserService";
import { Logger } from "../../lib/logger";
import { CustomApiResponse, errorResponse, successResponse } from "../helpers/responseHandlers";
import { AuthUserDTO, CreateUserDTO, EmailVerificationDTO, UpdateUserDTO } from "../dtos/UserDTO";
import { sanitizeUser } from "../helpers/utils";

@Route("users")
@Tags("Users")
@Service()
export class UserController extends Controller {
  constructor(
    private readonly userService: UserService,
    @Inject(() => Logger) private readonly logger: Logger
  ) {
    super();
  }

  /**
   * Register a new user
   */
  @Post()
  @SuccessResponse("201", "User registered successfully")
  @Response<CustomApiResponse>("400", "Bad Request")
  public async registerUser(@Body() body: CreateUserDTO): Promise<CustomApiResponse> {
    try {
      const user = await this.userService.registerUser(body);
      return successResponse(
        "User registered successfully. Please check your email for verification",
        201,
          { userId: user.id, email: user.email, walletCreated: !!user.wallet }

      );
    } catch (error: any) {
      this.logger.error("User registration failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

   // ✅ 1. GET endpoint for link-based verification
@Get("/emailVerification/{verification_token}/{otp}")
@SuccessResponse("200", "Email verified successfully")
@Response<CustomApiResponse>("400", "Invalid or expired token")
public async validateEmail(
  @Path("verification_token") verification_token: string,
  @Path("otp") otp: string
): Promise<CustomApiResponse> {
  try {
    await this.userService.validateEmail({ otp, verification_token });

    return successResponse("Email verified successfully", 200);
  } catch (error: any) {
    this.logger.error({
      activity_type: "USER_VERIFICATION",
      message: error.message || "Email verification failed",
      metadata: { verification_token, otp },
    });

    return errorResponse(error.message, error.statusCode || 400);
  }
}


// ✅ 2. POST endpoint for form-based verification
@Post("/verify-email")
@SuccessResponse("200", "Email verified successfully")
@Response<CustomApiResponse>("400", "Invalid or expired token")
public async verifyEmail(
  @Body() body: EmailVerificationDTO
): Promise<CustomApiResponse> {
  try {
    await this.userService.validateEmail(body);

    return successResponse("Email verified successfully", 200);
  } catch (error: any) {
    this.logger.error({
      activity_type: "USER_VERIFICATION",
      message: error.message || "Email verification failed",
      metadata: body,
    });

    return errorResponse(error.message, error.statusCode || 400);
  }
}
  /**
   * Login user
   */
  @Post("/login")
  @SuccessResponse("200", "Login successful")
  @Response<CustomApiResponse>("400", "Invalid credentials")
  public async loginUser(@Body() body: AuthUserDTO): Promise<CustomApiResponse> {
    try {
      const token = await this.userService.loginUser(body.email, body.password);
      const user = await this.userService.getUserByEmail(body.email);
      this.setHeader("Authorization", `Bearer ${token}`);
      return successResponse("Login successful", 200, { token, user });
    } catch (error: any) {
      this.logger.error("Login failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * List users (with pagination & search)
   */
  @Get("/")
  @Security("bearerAuth")
  @SuccessResponse("200", "Users retrieved successfully")
  @Response<CustomApiResponse>("400", "Bad Request")
  public async listUsers(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("search") search?: string
  ): Promise<CustomApiResponse> {
    try {
      const users = await this.userService.listUsers(page || 1, limit || 10, search);
      return successResponse("Users retrieved successfully", 200, users);
    } catch (error: any) {
      this.logger.error("List users failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * Get a single user by ID
   */
  @Get("/{id}")
  @Security("bearerAuth")
  @SuccessResponse("200", "User retrieved successfully")
  @Response<CustomApiResponse>("404", "User not found")
  public async getUser(@Path() id: string): Promise<CustomApiResponse> {
    try {
      const user = await this.userService.getUserById(id);
      return successResponse("User retrieved successfully", 200, user);
    } catch (error: any) {
      this.logger.error("Get user failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * Update a user
   */
  @Put("/{id}")
  @Security("bearerAuth")
  @SuccessResponse("200", "User updated successfully")
  @Response<CustomApiResponse>("400", "Bad Request")
  public async updateUser(@Path() id: string, @Body() body: UpdateUserDTO): Promise<CustomApiResponse> {
    try {
      const user = await this.userService.updateUser(id, body);
      return successResponse("User updated successfully", 200, user);
    } catch (error: any) {
      this.logger.error("Update user failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }

  /**
   * Delete a user
   */
  @Delete("/{id}")
  @Security("bearerAuth")
  @SuccessResponse("200", "User deleted successfully")
  @Response<CustomApiResponse>("404", "User not found")
  public async deleteUser(@Path() id: string): Promise<CustomApiResponse> {
    try {
      await this.userService.deleteUser(id);
      return successResponse("User deleted successfully", 200);
    } catch (error: any) {
      this.logger.error("Delete user failed:", error);
      return errorResponse(error.message, error.statusCode || 500);
    }
  }
}
