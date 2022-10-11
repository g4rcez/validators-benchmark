import express, { json, Request, Response, NextFunction } from "express";
import { typeboxMiddleware } from "./validators/typebox";
import axios from "axios";
import { createItem } from "./type";

const okayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return res.json({ payload: req.body });
};

const app = express();
app.use(json()).post("/typebox", typeboxMiddleware, okayMiddleware);

app.listen(5000, async () => {
  console.log(":5000");
  const response = await axios.post(
    "http://localhost:5000/typebox",
    createItem(1)
  );
  console.log(response.status, response.data);
});
