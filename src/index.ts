import "reflect-metadata";
import express from "express";
import { useContainer, useExpressServer } from "routing-controllers";
import dotenv, { configDotenv } from "dotenv";

import { setupContainer, Container } from "./di/container";
import { IndexController } from "./api/controllers/indexController";
import { IndexCallbackController } from "./api/controllers/indexCallbackController";
import { CalcController } from "./api/controllers/calcController";
import { CalcCallbackController } from "./api/controllers/calcCallbackController";
import { AutoRedactController } from "./api/controllers/autoRedactController";
import { AutoRedactCallbackController } from "./api/controllers/autoRedactCallbackController";
import { AutoRecordController } from "./api/controllers/autoRecordController";
import { AutoRecordCallbackController } from "./api/controllers/autoRecordCallbackController";
import { ProvisionController } from "./api/controllers/provisionController";
import { ProvisionCallbackController } from "./api/controllers/provisionCallbackController";
import { EndorseController } from "./api/controllers/endorseController";
import { EndorseCallbackController } from "./api/controllers/endorseCallbackController";
import { RedactController } from "./api/controllers/redactController";
import { RedactCallbackController } from "./api/controllers/redactCallbackController";
import { RefineController } from "./api/controllers/refineController";
import { RefineCallbackController } from "./api/controllers/refineCallbackController";



setupContainer(); 
useContainer(Container);

const app = express();
//app.use(express.json());

useExpressServer(app, {
  controllers: [
    IndexController, 
    IndexCallbackController,
    CalcController, 
    CalcCallbackController,
    EndorseController,
    EndorseCallbackController,
    RefineController,
    RefineCallbackController,
    RedactController,
    RedactCallbackController,
    AutoRedactController,
    AutoRedactCallbackController,
    AutoRecordController, 
    AutoRecordCallbackController, 
    ProvisionController,
    ProvisionCallbackController,

  ],
  defaultErrorHandler: false
});



dotenv.config(); // Ensure .env file is loaded
if (!process.env.TABULARIUM_URL || !process.env.TABULARIUM_API_KEY) {
  throw new Error("TABULARIUM_URL and TABULARIUM_API_KEY must be defined in .env file");
}


app.listen(3000, () => console.log("API running on http://localhost:3000"));
export { app }; // Export the app for testing or further configuration
