import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "color-picker": resolve(__dirname, "color-picker.html"),
      },
    },
  },
});
