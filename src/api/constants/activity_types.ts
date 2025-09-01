export const ACTIVITY_TYPES = {
    USER_REGISTRATION: "User registration",
    USER_LOGIN: "User login",
    USER_PROFILE: "Fetch user profile",
    USER_dELETE: "Delete user account",
    USER_UPDATE: "Update user account",
    USER:{
        PROFILE_UPDATE: "Update user profile",
        PASSWORD_RESET:{
            REQUEST: "Request for password reset",
            NEW_PASSWORD: "Set a new password"
        },
        DELETED: "User account deleted",
    },
    USER_EMAIL_VERIFICATION: "Email Verification",
    WITHDRAWAL_ACCOUNT:{
        "CREATION": "Create new withdrawal bank account",
        "DELETE": "Remove withdrawal account",
        "LIST": "Fetch user's withdrawal accounts",
        "SHOW": "Fetch one withdrawal account of a user"
    },
    WALLET:{
        "CREATION": "Create new wallet",
        "CREDIT": "Credit wallet",
        "DEBIT": "Debit wallet",
        "FETCH": "Fetch wallet by user ID",
        "FETCH_ALL": "Fetch all wallets",
        "ERROR": "Wallet operation error",
        "DELETION": "Delete wallet",
        "UPDATE": "Update wallet",
        "FUND": "Fund wallet",
        "DEPOSIT": "Deposit into wallet",
        "WITHDRAW": "Withdraw from wallet",
        "VIEW": "View wallet details",
        "RESET": "Reset wallet",
        "INVALID_OPERATION": "Invalid wallet operation",
    },
    TRANSACTION_PIN: {
        "CREATION": "Create new transaction PIN"
    },
    USER_VERIFICATION: "User verification",
}