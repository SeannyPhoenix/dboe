import { defineConfig } from "oxfmt";

export default defineConfig({
  tabWidth: 2,
  semi: true,
  sortImports: true,
  insertFinalNewline: true,
  ignorePatterns: ["internal/server/web"],
});
