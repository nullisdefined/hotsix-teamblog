import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://223.130.133.112:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    preserveSymlinks: true,
  },
});
