import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // `any` is used pragmatically (e.g. ApexCharts option objects); keep it
      // visible as a warning instead of failing the production build.
      "@typescript-eslint/no-explicit-any": "warn",
      // Images here are base64 data URLs and MJPEG streams that next/image
      // cannot optimize, so the plain <img> element is intentional.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
