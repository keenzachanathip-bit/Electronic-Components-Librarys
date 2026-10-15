import test from "node:test";
import assert from "node:assert/strict";
import { decodeBands, formatOhms } from "../src/utils/resistor.js";

test("four and five band color codes decode the resistor value and tolerance", () => {
  assert.deepEqual(decodeBands(["orange", "orange", "brown", "gold"]), { ohms: 330, tolerance: 5 });
  assert.deepEqual(decodeBands(["brown", "black", "orange", "gold"]), { ohms: 10000, tolerance: 5 });
  assert.deepEqual(decodeBands(["orange", "orange", "black", "black", "brown"]), { ohms: 330, tolerance: 1 });
  assert.equal(decodeBands(["black", "brown", "red", "gold"]), null);
  assert.equal(formatOhms(4700), "4.7 kΩ");
});

