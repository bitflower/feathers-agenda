import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { AgendaService } from "../src";

describe("index", function () {
  it("exports all members", function () {
    assert.ok(AgendaService);
  });
});
