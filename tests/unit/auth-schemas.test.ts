import { describe, expect, it } from "vitest";

import { safeInternalPath } from "../../src/features/auth/schemas";

describe("safeInternalPath", () => {
  it.each(["/dashboard", "/dashboard/decks", "/dashboard/settings/profile"])(
    "allows protected application paths",
    (path) => {
      expect(safeInternalPath(path)).toBe(path);
    },
  );

  it.each([undefined, null, "https://example.com", "//example.com", "/login"])(
    "falls back to the dashboard for %s",
    (path) => {
      expect(safeInternalPath(path)).toBe("/dashboard");
    },
  );
});
