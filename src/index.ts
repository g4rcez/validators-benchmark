import * as Benchmark from "benchmark";
import { createList, Request } from "./type";
import zod from "./validators/zod";
import ajv from "./validators/ajv";
import joi from "./validators/joi";
import typebox from "./validators/typebox";

const createBenchmark = (array: Request[], afterComplete: () => void) => {
  const suite = new Benchmark.Suite();
  suite
    .add("joi integration", async () => {
      await joi(array);
    })
    .add("Ajv integration + FluentSchemaValidator", async () => {
      await ajv(array);
    })
    .add("Zod integration", async () => {
      await zod(array);
    })
    .add("Typebox integration", async () => {
      await typebox(array);
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log(
        `\x1b[34m[Test with ${array.length}]\x1b[0m`,
        `Fastest is \x1b[32m${this.filter("fastest").map("name")}\x1b[0m`,
        "\n"
      );
      afterComplete();
    })
    .run({ async: true });
};

createBenchmark(createList(100), () => {
  createBenchmark(createList(1000), () => {
    createBenchmark(createList(5000), () => {
      createBenchmark(createList(10000), () => {
        createBenchmark(createList(50000), () => {
          console.log("Finished");
        });
      });
    });
  });
});
