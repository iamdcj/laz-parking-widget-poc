import { transformDuration } from "./time";
import {
  cleanObject,
  constructBuyLink,
  returnUrlParams,
} from "./urls";


describe("constructBuyLink", () => {
  it("only return the params for the data provided", () => {
    const url = constructBuyLink({
      mode: "EVT",
      l: "1987",
      evid: "1899",
      wk: "12345",
      aid: "foo",
      sc: "bar",
    });

    expect(url).toEqual(
      "https://go.lazparking.com/buynow?t=e&wt=evt&isocode=EN&l=1987&evid=1899&wk=12345&aid=foo&sc=bar"
    );
  });
});

describe("transformDuration", () => {
  it("return a valid duration for hour increments", () => {
    const duration = transformDuration("2H");

    expect(duration).toEqual("120");
  });

  it("return a valid duration for minute increments", () => {
    const duration = transformDuration("30M");

    expect(duration).toEqual("30");
  });
});

describe("cleanObject", () => {
  it("return an empty object if all fields are falsy", () => {
    const data = cleanObject({
      foo: 1,
      bar: 0,
      baz: "oi",
      qux: "hello",
      quux: undefined,
    });

    expect(data).toEqual({ foo: 1, baz: "oi", qux: "hello" });
  });
});

describe("returnParams", () => {
  it("return an empty object if all fields are falsy", () => {
    const UrlParams = returnUrlParams(
      {
        duration: "",
        widgetKey: null,
        rid: null,
        l: null,
        evid: null,
        wk: null,
        aid: null,
        sc: null,
        start: null,
        end: null,
      },
      null
    );

    expect(UrlParams).toEqual({});
  });

  it("return a string representation for start and/or end field", () => {
    const start = new Date("1987-05-13T09:00:00Z");
    const end = new Date("1987-05-13T12:00:00Z");

    const UrlParams = returnUrlParams(
      {
        start,
        end,
      },
      "TMD"
    );

    expect(UrlParams).toEqual({
      start: "Wed May 13 1987 05:00:00 GMT-0400 (Eastern Daylight Time)",
      end: "Wed May 13 1987 08:00:00 GMT-0400 (Eastern Daylight Time)",
    });
  });
});
