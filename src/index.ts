import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
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
import { ReprocessController } from "./api/controllers/reprocessController";
import { ReprocessCallbackController } from "./api/controllers/reprocessCallbackController";
import { ResultsController } from "./api/controllers/resultsController";



setupContainer();
useContainer(Container);

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

//app.use(express.json());

useExpressServer(app, {
  controllers: [
    IndexController,
    IndexCallbackController,
    CalcController,
    CalcCallbackController,
    EndorseController,
    EndorseCallbackController,
    ReprocessController,
    ReprocessCallbackController,
    RedactController,
    RedactCallbackController,
    AutoRedactController,
    AutoRedactCallbackController,
    AutoRecordController,
    AutoRecordCallbackController,
    ProvisionController,
    ProvisionCallbackController,
    ResultsController,

  ],
  defaultErrorHandler: false
});



dotenv.config(); // Ensure .env file is loaded

// Only listen if not in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(3000, () => console.log("API running on http://localhost:3000"));
}

export { app }; // Export the app for testing or further configuration
export default app; // Default export for Vercel
