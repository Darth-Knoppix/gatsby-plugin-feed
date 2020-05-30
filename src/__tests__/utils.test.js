import { cleanDate } from "../utils";

describe("Utils", () => {
  describe("cleanDate/1", () => {
    it("should return valid Date when given a Date", () => {
      const testDate = new Date();
      expect(cleanDate(testDate)).toBe(testDate);
    });

    it("should return valid Date when given a valid date string", () => {
      expect(cleanDate("2020-05-25T08:36:39.687Z")).toBeInstanceOf(Date);
    });

    it("should return undefined when given null or undefined", () => {
      expect(cleanDate(null)).toBeUndefined();
      expect(cleanDate(undefined)).toBeUndefined();
    });
  });
});
