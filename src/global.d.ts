declare module "jsonwebtoken" {
    import jwt from "jsonwebtoken";
    export = jwt;
}

declare module "swagger-ui-express" {
    import swaggerUi from "swagger-ui-express";
    export = swaggerUi;
}

declare module "chance" {
    import Chance from "chance";
    export = Chance;
}

declare module "compression" {
    import compression from "compression";
    export = compression;
}

declare module "cors" {
    import cors from "cors";
    export = cors;
}

import { JwtPayload } from "../../authentication";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
