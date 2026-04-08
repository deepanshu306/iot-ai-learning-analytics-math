import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/iot-ai-learning-analytics-math/react-app/" : "/",
  build: {
    outDir: "../react-app",
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
}));
