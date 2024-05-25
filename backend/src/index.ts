import express from "express";
import cors from "cors";

import { routeController } from "./controllers/routeController";

const app = express();
const port = 3000;

app.use(cors());

app.get("/route", routeController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app };
