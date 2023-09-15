import { cleanup } from "@solidjs/testing-library";
import "@testing-library/jest-dom";
import matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect } from "vitest";

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});
