import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
  path: "./.env",
});

const startServer = () => {
  app.listen(process.env.PORT || 8000, () => {
    console.info(
      `🩺 Healthcheck at: http://localhost:${
        process.env.PORT || 8080
      }/api/v1/healthcheck`
    );
    console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
  });
};
connectDB()
.then(() => {
    startServer();
  })
  .catch((err) => {
    console.log("Mongo db connect error: ", err);
  });