import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  rules: {
    "no-param-reassign": "error",
  },
  ignorePatterns: ["internal/server/web"],
});
