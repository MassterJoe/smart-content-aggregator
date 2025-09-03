import { 
  IsArray,
  IsDateString,
  IsEmail, 
  IsEnum,
  IsOptional, 
  IsString, 
  IsStrongPassword, 
  Length 
} from "class-validator";
import { Example } from "tsoa";

/**
 * DTO for creating a new user
 */
export class CreateUserDTO {
  @IsString()
  @Length(3, 30)
  @Example("SalawuJoseph")
  username!: string;

  @IsEmail()
  @Example("john.doe@example.com")
  email!: string;

  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" }
  )
  @Example("Password123!")
  password!: string;

  @IsOptional()
  @IsEnum(["user", "admin"])
  @Example("user")
  role?: "user" | "admin";

  @IsOptional()
  @IsEnum(["active", "inactive", "suspended"])
  @Example("active")
  status?: "active" | "inactive" | "suspended";

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Example(["tech", "sports"])
  interests?: string[];
}

/**
 * DTO for user login
 */
export class AuthUserDTO {
  @IsEmail({}, { message: "Valid email is required" })
  @Example("john.doe@example.com")
  email!: string;

  @IsString()
  @Length(8, 50)
  @Example("Password123!")
  password!: string;
}

/**
 * DTO for updating an existing user
 */
export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @Length(3, 30)
  @Example("NewUsername")
  username?: string;

  @IsOptional()
  @IsEmail()
  @Example("john.doe@example.com")
  email?: string;

  @IsOptional()
  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: "Password must be strong if updated" }
  )
  @Example("NewPassword123!")
  password?: string;

  @IsOptional()
  @IsEnum(["active", "inactive", "suspended"])
  @Example("inactive")
  status?: "active" | "inactive" | "suspended";

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Example(["politics", "health"])
  interests?: string[];
}

/**
 * DTO for verifying user email
 */
export class EmailVerificationDTO {
  @IsString()
  @Example("123456")
  otp!: string;

  @IsString()
  @Example("a1b2c3d4-e5f6-7890-1234-56789abcdef0")
  verification_token!: string;
}

/**
 * DTO for email verification response
 */
export class EmailVerificationResponseDTO {
  @Example(true)
  isSuccess!: boolean;

  @Example("Email verified successfully")
  message!: string;
}
