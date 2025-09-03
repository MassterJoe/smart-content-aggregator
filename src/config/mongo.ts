import mongoose from "mongoose"
import { env } from "../env";

const dbConnectionString = env.db.mongo.url;

export const dbConnection = mongoose.connect(dbConnectionString)
.then((res: any)=>{
    console.log("✅  Connected to MongoDB database");
})
.catch((err: any) => {
    console.log(`❌  Error connecting to MongoDB database >> ${err}`);
});