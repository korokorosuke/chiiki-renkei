import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node", // or "jsdom" for browser-like testing
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".output", ".git"],
    pool: "forks",
  },
})