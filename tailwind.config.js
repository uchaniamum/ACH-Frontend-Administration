import fs from "fs";
import path from "path";

const c12Directory = fs.readdirSync("node_modules/.c12");
let tailwindBaseConfig = {};

for (const dir of c12Directory) {
  if (fs.existsSync(path.join("node_modules/.c12", dir, "tailwind.config.js"))) {
    tailwindBaseConfig = require("./" + path.join("node_modules/.c12", dir, "tailwind.config.js"));
    break
  }
}

export default {
  ...tailwindBaseConfig,
  content: [
    "./node_modules/.c12/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./error.vue",
    ...tailwindBaseConfig.content
  ],
};