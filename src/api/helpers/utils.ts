import Chance from "chance";
const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken"
import { env } from "../../env";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { CharacterCasing } from "../enums/CharacterCasing";
import { GoogleGenerativeAI } from "@google/generative-ai";


const DEFAULT_CHARACTER_LENGTH = 12;

const chance = new Chance();

const geminiApiKey = env.GEMINI_API_KEY;
if (!geminiApiKey) throw new Error("API_KEY not set");

const googleAI = new GoogleGenerativeAI(geminiApiKey);
// const geminiConfig = {
//   temperature: 0.7,
//   topP: 1,
//   topK: 1,
//   maxOutputTokens: 300, 
// };

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




export async function generateSummary(content: string): Promise<string> {
  const prompt = `
  Summarize the following article into a concise summary, keeping the main points intact:
  ${content}
  `;

  const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const summary = response.text();

  return summary.trim();
}

