import { validator } from "../type";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Type } from "@sinclair/typebox";
import { NextFunction, Request, Response } from "express";
import { Format } from "@sinclair/typebox/format";
import addFormats from "ajv-formats";

const emailFormat = addFormats.get("email", "fast") as RegExp;
const uuidFormat = addFormats.get("uuid", "fast") as RegExp;

const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
Format.Set("iso-date-js", (value) => isoDateRegex.test(value));
Format.Set("email", (v) => emailFormat.test(v));
Format.Set("uuid", (v) => uuidFormat.test(v));

const id = Type.String({ format: "uuid" });
const date = Type.String({ format: "iso-date-js" });

const objectSchema = Type.Object({
  id,
  from: date,
  to: date,
  products: Type.Array(
    Type.Object({
      id,
      quantity: Type.Integer(),
      discount: Type.String({ minLength: 1 }),
    })
  ),
  user: Type.Object({
    name: Type.String({ minLength: 1 }),
    email: Type.String({ format: "email" }),
    birthDate: date,
    roles: Type.Array(Type.String({ minLength: 1 })),
    username: Type.RegEx(/^[a-z][a-zA-Z0-9_-]{1,31}/),
  }),
});

const compiledObjectSchema = TypeCompiler.Compile(objectSchema);

const schema = TypeCompiler.Compile(Type.Array(objectSchema));

export const typeboxMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const valid = compiledObjectSchema.Check(req.body);
    const errors = [...compiledObjectSchema.Errors(req.body)];
    if (valid) {
      return next();
    }
    console.log(errors);
    return res.status(400).json({ errors });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ e });
  }
};

export default validator(async (request) => {
  await schema.Check(request);
});
