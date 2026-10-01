import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import createHtmlPlugin from "vite-plugin-simple-html";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isProduction = mode === "production";
  const missingSupabaseVariables = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
  ].filter((name) => !env[name]);

  if (isProduction && missingSupabaseVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingSupabaseVariables.join(", ")}`,
    );
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      visualizer({
        open: false,
        filename: "./dist/stats.html",
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            mainScript: `src/main.tsx`,
          },
        },
      }),
    ],
    define: isProduction
      ? {
          "import.meta.env.VITE_IS_DEMO": JSON.stringify(env.VITE_IS_DEMO),
          "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
            env.VITE_SUPABASE_URL,
          ),
          "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
            env.VITE_SUPABASE_ANON_KEY,
          ),
          "import.meta.env.VITE_INBOUND_EMAIL": JSON.stringify(
            env.VITE_INBOUND_EMAIL,
          ),
        }
      : undefined,
    base: "./",
    esbuild: {
      keepNames: true,
    },
    build: {
      sourcemap: true,
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
