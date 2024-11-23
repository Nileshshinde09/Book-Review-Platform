import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limiter } from "./middlewares/index.js";
import requestIp from "request-ip";
import { convertImagesToBase64AndWrite } from "./utils/ImagesToBase64.js";
import { INPUTDIRECTORY, OUTPUTJSONFILE } from "./constants.js";
const app = express();
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*"
        : process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); 
  next();
});

app.use(requestIp.mw());
app.use(limiter);
app.use(express.json({ limit: "2000kb" }));
app.use(express.urlencoded({ extended: true, limit: "2000kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// convertImagesToBase64AndWrite(INPUTDIRECTORY, OUTPUTJSONFILE);

//HealthCheck route
//-------------------------------------------------------------
import healthcheck from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheck);
//-------------------------------------------------------------

//User route
//-------------------------------------------------------------
import user from "./routes/user.routes.js";
app.use("/api/v1/user", user);
//-------------------------------------------------------------

//Books route
//-------------------------------------------------------------
import book from "./routes/book.routes.js"
app.use("/api/v1/book", book);  
//-------------------------------------------------------------


export { app };
