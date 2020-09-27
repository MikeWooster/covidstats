import { getNeighbouringLAs } from "./geo";

test("geocodes coordinates", () => {
  const got = getNeighbouringLAs(-0.127758, 51.507351, 5000);
  expect(got).toEqual([
    "E09000001",
    "E09000007",
    "E09000019",
    "E09000020",
    "E09000022",
    "E09000033",
  ]);
});

test("geocodes coordinates uses nearest available", () => {
  const got = getNeighbouringLAs(0.280734, 51.186201, 10);
  expect(got).toEqual(["E07000115"]);
});
