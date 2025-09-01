import { 
  IsDateString,
  IsEmail, 
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
  @IsEmail()
  @Example("john.doe@example.com")
  email!: string;

  @IsString()
  @Length(3, 50)
  @Example("John")
  first_name!: string;

  @IsString()
  @Length(3, 50)
  @Example("Doe")
  last_name!: string;

  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" }
  )
  @Example("Password123!")
  password!: string;

  @IsOptional()
  @IsString()
  @Example("+2348012345678")
  phone_number?: string;

  @IsOptional()
  @IsString()
  @Example("12345678901")
  bvn?: string;

  @IsOptional()
  @IsDateString()
  @Example("1990-01-01")
  bvn_dob?: string;
}

/**
 * DTO for user login
 */
export class AuthUserDTO {
  @IsEmail({}, { message: "Valid email is required" })
  @Example("john.doe@example.com")
  email!: string;

  @IsString()
  @Length(8, 20)
  @Example("Password123!")
  password!: string;
}

/**
 * DTO for updating an existing user
 */
export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @Example("John")
  first_name?: string;

  @IsOptional()
  @IsString()
  @Example("Doe")
  last_name?: string;

  @IsOptional()
  @IsEmail()
  @Example("john.doe@example.com")
  email?: string;

  @IsOptional()
  @IsString()
  @Example("+2348012345678")
  phone_number?: string;

  @IsOptional()
  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: "Password must be strong if updated" }
  )
  @Example("NewPassword123!")
  password?: string;
}

/**
 * DTO for verifying user email
 */
export class EmailVerificationDTO {
  @IsOptional()
  @IsString()
  @Example("123456")
  otp?: string;

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
