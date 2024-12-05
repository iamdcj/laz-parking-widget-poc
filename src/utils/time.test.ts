import { transformDuration } from "./time";

describe("transformDuration", () => {
  it("removes H/h from the string", () => {
    const lower = transformDuration("100h");
    const upper = transformDuration("100H");

    expect(lower).toEqual(100);
    expect(upper).toEqual(100);
  });

  it("removes D/d from the string", () => {
    const lower = transformDuration("100d");
    const upper = transformDuration("100D");

    expect(lower).toEqual(100);
    expect(upper).toEqual(100);
  });

  it("removes M/m from the string", () => {
    const lower = transformDuration("100m");
    const upper = transformDuration("100M");

    expect(lower).toEqual(100);
    expect(upper).toEqual(100);
  });
});
