import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: ["internal/server/web"],
});
