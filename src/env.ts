import * as path from "path";

import * as dotenv from "dotenv";

import * as pkg from "../package.json";

import {
    getOsEnv,
    getOsEnvWithDefault,
    normalizePort
} from "./lib/env";

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
    ),
});


export const env = {
    isProduction: ["prod", "production"].includes(process.env.NODE_ENV as unknown as string),
    isDevelopment: ["dev", "development"].includes(process.env.NODE_ENV as unknown as string),
    isLocal: process.env.NODE_ENV === "local",
    isTest: process.env.NODE_ENV === "test",

    app: {
        name: (pkg as any).name,
        displayName: (pkg as any).displayName || (pkg as any).name,
        version: (pkg as any).version,
        url: getOsEnv("APP_URL"),
        port: normalizePort(process.env.PORT || ""),
        host: getOsEnv("HOST"),
        client_url: getOsEnv("client_url")
    },
    log: {
        level: getOsEnvWithDefault("LOG_LEVEL", "debug"),
    },
    db: {
        mongo: {
            url: getOsEnv("MONGO_DB_URL"),
            dbName: getOsEnv("MONGO_DB_NAME"),
        },
    },
    // cache: {
    //     redis: {
    //         host: getOsEnv("REDIS_HOST"),
    //         port: normalizePort(getOsEnv("REDIS_PORT")),
    //         user: getOsEnv("REDIS_USERNAME"),
    //         pass: getOsEnv("REDIS_PASSWORD"),
    //     }
    // },
    jwtConfig:{
        secret: getOsEnv('JWT_SECRET'),
        issuer: getOsEnv('JWT_ISSUER'),
    },   
    SENDGRID_API_KEY: getOsEnv("SENDGRID_API_KEY"),
    MAIL_FROM: getOsEnv("MAIL_FROM"),
    RABBITMQ_URL: getOsEnv("RABBITMQ_URL"),
    // OKRA:{
    //     BASE_URL: getOsEnv('OKRA_URL'),
    //     KEY: getOsEnv('OKRA_KEY'),
    // }
};