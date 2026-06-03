import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/.claude/**",
      "**/.vercel/**",
      "**/.kilocode/**",
      "**/coverage/**",
      "awesome-design-md/**",
      "temp-agents/**",
    ],
  },
  {
    extends: [...next],
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);
