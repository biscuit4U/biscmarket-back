import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import "dotenv/config";
import { globalRateLimit } from "./middlewares/rateLimit.js";
import router from "./routes/allRoutes.js";

const app = express();

// Add trust proxy setting (REQUIRED for Railway)
app.set('trust proxy', 1);

app.use(cors({
    origin: "https://investment-website-client-side-jugn.vercel.app",
    credentials: true
}))

app.use(globalRateLimit)


app.use(helmet())
app.use(hpp())
app.use(express.json())
app.use(cookieParser())


app.use('/', router)

app.listen(8080)