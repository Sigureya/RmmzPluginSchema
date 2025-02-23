import { makeDefault, NumberArg } from "@schema";

const xx = () => {
  const ant: NumberArg = {
    type: "number",
    default: 10,
  };
  const d = makeDefault(ant);
};
