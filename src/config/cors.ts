//import { env } from "../../env";
import { CONFIGS } from ".";

export const corsOptions = {
    origin: CONFIGS.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    allowedHeaders: CONFIGS.HTTP_ALLOWED_HEADERS,
    methods: CONFIGS.HTTP_METHODS,
    credentials: true,
};