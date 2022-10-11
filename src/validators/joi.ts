import { validator } from "../type";
import * as Joi from "joi";

const date = Joi.date().options({ dateFormat: "iso" });
const schema = Joi.array().items(
  Joi.object({
    from: date,
    to: date,
    id: Joi.string().uuid(),
    products: Joi.array().items(
      Joi.object({
        id: Joi.string().uuid(),
        quantity: Joi.number().integer(),
        discount: Joi.string(),
      })
    ),
    user: Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email(),
      birthDate: date,
      roles: Joi.array().items(Joi.string().min(1)),
      username: Joi.string().regex(/^[a-z][a-zA-Z0-9_-]{1,31}/),
    }),
  })
);

export default validator(async (data) => {
  await schema.validateAsync(data);
});
