import S from "fluent-json-schema";
import { validator } from "../type";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, allowMatchingProperties: true });
addFormats(ajv);

const schema = S.array()
  .items(
    S.object()
      .required(["from", "to", "id", "products", "user"])
      .prop("from", S.string().format(S.FORMATS.DATE_TIME))
      .prop("to", S.string().format(S.FORMATS.DATE_TIME))
      .prop("id", S.string().format(S.FORMATS.UUID))
      .prop(
        "customer",
        S.object()
          .id("#customer")
          .title("Customers")
          .prop("name", S.string().minLength(1))
          .prop("email", S.string().format(S.FORMATS.EMAIL))
          .prop("birthDate", S.string().format(S.FORMATS.DATE_TIME))
          .prop("username", S.string())
          .prop("roles", S.array().items(S.string()))
          .required(["name", "email", "birthDate", "roles", "username"])
      )
      .prop(
        "products",
        S.array().items(
          S.object()
            .id("#products")
            .title("Products")
            .prop("id", S.string().format(S.FORMATS.UUID))
            .prop("quantity", S.integer())
            .prop("discount", S.string().minLength(1))
            .required(["id", "quantity", "discount"])
        )
      )
  )
  .valueOf();

const schemaName = "schema";
ajv.addSchema(schema, schemaName);

export default validator(async (data) => {
  const compile = ajv.getSchema(schemaName)!;
  await compile(data);
});
