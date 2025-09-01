import compression from "compression";
import cors from "cors";
import { Application, json, Request, Response, urlencoded } from "express";
import rateLimit from "express-rate-limit";
import helmet, { contentSecurityPolicy } from "helmet";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../api/swagger/swagger.json";
import {ConsumerService} from "../api/queues/consumerService";
import { Container } from "typedi";

import { env } from "../env";
import { logLoader } from "./logger";
import { postgresLoader } from "./postgres";
// import { redisLoader } from "./redis";
import { corsOptions } from "./cors";
import { RegisterRoutes } from "../api/routes/routes";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

const expressConfig = async (app: Application): Promise<void> => {
  // Security & middlewares
  app.use(cors(corsOptions));
  app.use(limiter);
  app.use(compression());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use(helmet());
  app.use(
    contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    })
  );

  // Infra loaders
  await logLoader();
  await postgresLoader();
  // await redisLoader();
  RegisterRoutes(app);
  const consumerService = Container.get(ConsumerService);
  await consumerService.startConsumer();
  
  // API Docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  

};

export default expressConfig;
