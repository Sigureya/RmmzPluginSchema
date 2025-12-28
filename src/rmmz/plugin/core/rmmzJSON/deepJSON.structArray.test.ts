import { describe, expect, test } from "vitest";
import { parseDeepJSON, parseDeepRecord } from "./parseDeepJSON";
import { stringifyDeepJSON, stringifyDeepRecord } from "./stringifyDeepJSON";

interface Item {
  id: number;
  name: string;
}

interface Address {
  city: string;
  country: string;
}

interface Person {
  name: string;
  age: number;
  nicknames: string[];
  numbers: number[];
  items: Item[];
  address: Address;
}

describe("deepJSON struct array", () => {
  const data: Person[] = [
    {
      name: "alice",
      age: 25,
      nicknames: ["ally", "a"],
      numbers: [1, 2, 3.5],
      items: [
        { id: 1, name: "item1" },
        { id: 2, name: "item2" },
      ],
      address: {
        city: "Wonderland",
        country: "Fictionland",
      },
    },
  ];
  test("stringifyDeepJSON and parseDeepJSON", () => {
    const json = stringifyDeepJSON(data);
    const parsed = parseDeepJSON(json);
    expect(parsed).toEqual(data);
  });
  test("stringifyDeepRecord and parseDeepRecord", () => {
    const record = stringifyDeepRecord({ people: data });
    const parsed = parseDeepRecord(record);
    expect(parsed).toEqual({ people: data });
  });
});
