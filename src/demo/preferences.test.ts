import { loadSessionPreferences, preferencesStorageKey, saveSessionPreferences } from "./preferences";

beforeEach(() => sessionStorage.removeItem(preferencesStorageKey));
afterEach(() => vi.restoreAllMocks());

it("restores valid session preferences and validates each stored field", () => {
  saveSessionPreferences({ theme: "purple", mode: "dark", fontStyle: "clear", size: "large", density: "compact" });
  expect(loadSessionPreferences()).toEqual({ theme: "purple", mode: "dark", fontStyle: "clear", size: "large", density: "compact" });
  sessionStorage.setItem(preferencesStorageKey, JSON.stringify({ theme: "pink", mode: "neon", fontStyle: "missing", size: 20, density: null }));
  expect(loadSessionPreferences()).toEqual({ theme: "pink", mode: "light", fontStyle: "playful", size: "medium", density: "comfortable" });
});

it("falls back safely for malformed or unavailable session storage", () => {
  sessionStorage.setItem(preferencesStorageKey, "not JSON");
  expect(loadSessionPreferences().theme).toBe("primary");
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("Blocked"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
  expect(loadSessionPreferences().mode).toBe("light");
  expect(() => saveSessionPreferences(loadSessionPreferences())).not.toThrow();
});
