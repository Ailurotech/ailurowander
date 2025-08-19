import adapterNode from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Use adapter-node to have explicit control over server configuration
    // This allows for larger file uploads
    adapter: adapterNode({
      // Generate custom polka/express server to configure body size limits
      out: 'build'
    }),
  },
};

export default config;
