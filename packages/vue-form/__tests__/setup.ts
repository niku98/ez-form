import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/vue";
import { afterEach } from "vitest";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	try {
		cleanup();
	} catch (error) {
		//
	}
});
