import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0"
  }
});
// IMPORTANT:
// host: true is required for mobile / LAN testing
