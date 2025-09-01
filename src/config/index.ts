import {env} from "../env";

export const CONFIGS = {
  HTTP_ALLOWED_HEADERS: [
    "Content-Type",
    "Authorization",
    "Origin",
    "Accept",
    "X-Requested-With",
  ],  
    HTTP_METHODS:["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    CORS_ORIGIN: env.app.client_url,
}