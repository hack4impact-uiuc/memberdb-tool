const { isValidChapter } = require("../src/utils/chapters")

describe("isValidChapter", () => {
    test("should return true given a valid chapter key", () => {
        expect(isValidChapter("UPENN")).toBe(true);
    })

    test("should return false given a nonexistent chapter key", () => {
        expect(isValidChapter("FAKE")).toBe(false);
    })
})