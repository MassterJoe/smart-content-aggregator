import Chance from "chance";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken"
import { env } from "../../env";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { CharacterCasing } from "../enums/CharacterCasing";
import User from "../models/User";


const DEFAULT_CHARACTER_LENGTH = 12;

const chance = new Chance();


export function generateRandomString(
    {
        length = DEFAULT_CHARACTER_LENGTH,
        casing = CharacterCasing.LOWER,
        numericOnly = false
    }:
    { length?: number, casing?: "upper" | "lower", numericOnly?: boolean }
    ): string {
    if (length <= 0) return "";

    const randomString = chance.string({ length, casing, alpha: !numericOnly, numeric: true });
    return randomString;
}

    export async function hashString(input: string): Promise < string > {
    if(!input) return "";

    const salt = await bcrypt.genSalt(10);
    const hashedString = await bcrypt.hash(input, salt);

    return hashedString;
}


   export async function compareHash(input: string, hash: string): Promise < boolean > {
    const isSame = await bcrypt.compare(input, hash);
    return isSame;
}

    /**
     * generateJWT
     */
    export function generateJWT(email: string, id: string) {
        const jwtData = {
            email, 
            id
        }
        return jwt.sign({ jwtData }, env.jwtConfig.secret, {
            expiresIn: '3600s',
            issuer: env.jwtConfig.issuer,
            audience: email
        });
    }

    export function generateUUID() {
        const currentTime = moment();
        const lifeSpan = 24
        const expiresAt = currentTime.add(lifeSpan,'hours').format() as unknown as Date;
        return {
            uuid: uuid(),
            expiresAt
        }
    }


    export function hasExpired(expectedExpirationDate: any){
        const currentTime = moment();
        if(currentTime.isAfter(expectedExpirationDate)){
            return true;
        }
        return false
    }


export const sanitizeUser = (user: User) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number
  };
};
