import { randomUUID } from "crypto";

export type Request = {
  from: string; // date format
  to: string; // date format
  id: string; // uuid
  products: Array<{
    id: string; // uuid
    quantity: number;
    discount: string;
  }>;
  user: {
    name: string;
    email: string;
    birthDate: string; // date format
    roles: string[];
    username: string; // ^[a-z][a-zA-Z0-9_-]{1,31}
  };
};

export const validator =
  (callback: (data: Request[]) => Promise<void>) => async (data: Request[]) => {
    await callback(data);
  };

const randInt = (max: number) => Math.ceil(Math.random() * max);

export const createItem = (index: number) => ({
  from: new Date().toISOString(),
  to: new Date().toISOString(),
  id: randomUUID(),
  user: {
    birthDate: new Date().toISOString(),
    email: `user${randInt(999999)}@test.com`,
    name: `Name user ${index}`,
    roles: Array.from({ length: randInt(5) }).map(() => randomUUID()),
    username: `username${index}`,
  },
  products: Array.from({ length: randInt(15) }).map(() => ({
    id: randomUUID(),
    quantity: randInt(900),
    discount: `cupom-${randInt(900)}`,
  })),
});

export const createList = (length: number) =>
  Array.from({ length }).map((x, index) => createItem(index));
