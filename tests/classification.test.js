import test from "node:test";
import assert from "node:assert/strict";
import { shouldRetryImage } from "../src/utils/classification.js";

test("prompts for another image at or below 70% only for real predictions", () => {
  assert.equal(shouldRetryImage([{ probability: 0.69 }]), true);
  assert.equal(shouldRetryImage([{ probability: 0.7 }]), true);
  assert.equal(shouldRetryImage([{ probability: 0.701 }]), false);
  assert.equal(shouldRetryImage([{ probability: 0.69 }], true), false);
  assert.equal(shouldRetryImage([]), false);
});
