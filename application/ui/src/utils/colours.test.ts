import { hexToRgb, rgbToHex } from "./colours";

test("hex to rgb", () => {
  const got = hexToRgb("#0033ff");
  const want = { r: 0, g: 51, b: 255 };
  expect(got).toEqual(want);
});

test.each([
  [{ r: 0, g: 51, b: 255 }, "#0033ff"],
  [{ r: 0.345, g: 51.421, b: 255.0000123 }, "#0033ff"],
])("rgb to hex", ({ r, g, b }, hexVal) => {
  const got = rgbToHex(r, g, b);
  expect(got).toEqual(hexVal);
});
