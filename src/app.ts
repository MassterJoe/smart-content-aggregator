import "reflect-metadata"; 
import express from "express";
import expressConfig from "./config/express";
import { env } from "./env";
import { Logger } from "./lib/logger"
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from './api/swagger/swagger.json';
 
const logger = new Logger();
(async () => {
    const { app: appInfo } = env;

    const app: express.Application = express();
   if (!env.isProduction) {
       app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   }
    await expressConfig(app);

    
    app.listen(appInfo.port, async () => {
        logger.info(`Swagger Doc is available at, ${ appInfo.url }: ${ appInfo.port }/api/docs`);
        
    });
})();