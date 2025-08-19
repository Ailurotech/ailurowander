import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // Configure dev server to handle larger uploads
    hmr: {
      port: 5174
    }
  },
  // Configure for production builds
  build: {
    target: 'node18'
  }
});
