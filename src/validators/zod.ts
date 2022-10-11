import { z } from "zod";
import { validator } from "../type";

const date = z.preprocess(
  (val) => (typeof val === "string" ? new Date(val) : val),
  z.date()
);
const uuid = z.string().uuid();

const schema = z.array(
  z.object({
    from: date,
    to: date,
    id: uuid,
    products: z.array(
      z.object({
        id: uuid,
        quantity: z.number().int(),
        discount: z.string().min(1),
      })
    ),
    user: z.object({
      name: z.string().min(1),
      username: z.string().regex(/^[a-z][a-zA-Z0-9_-]{1,31}/),
      email: z.string().email(),
      birthDate: date,
      roles: z.array(z.string()),
    }),
  })
);

export default validator(async (data) => {
  await schema.safeParseAsync(data);
});
