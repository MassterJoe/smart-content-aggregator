import { AccountStatus } from "../enums/AccountStatus";

export interface IUser {
    _id: string;
    email: string;
    password: string;
    otp: string;
    password_reset_token: string;
    password_reset_expires_at: Date;
    verified_at: Date;
    email_verification_token: string;
    email_verification_expires_at: Date;
    status: AccountStatus;
}
