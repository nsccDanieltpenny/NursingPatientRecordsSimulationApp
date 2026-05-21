import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import cspPlugin from "vite-plugin-csp-guard";

export default defineConfig(({ mode }) => {
  /*global process */
  const env = loadEnv(mode, process.cwd());
  const isProduction = () => mode === "production";

  return {
    plugins: [
      react(),
      // Content Security Policy
      // OWASP cheat sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
      // Plugin docs: https://vite-csp.tsotne.co.uk/
      cspPlugin({
        algorithm: "sha256",
        override: isProduction(), // Override the default policy in production
        dev: {
          run: true,
        },
        policy: {
          "default-src": [isProduction() ? "'none'" : "'self'"],
          "script-src": ["'self'"],
          "style-src-elem": [
            "'self'",
            "'unsafe-inline'", // Required for MUI and Emotion packages (https://vite-csp.tsotne.co.uk/guides/spa#caveats)
            "https://fonts.googleapis.com",
          ],
          "img-src": [
            "'self'",
            "data:", // Required for some injected icons
          ],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "connect-src": [
            "'self'",
            "https://login.microsoftonline.com",
            env.VITE_API_URL, // Allow to connect to the api url
          ],
          "object-src": ["'none'"],
          "base-uri": ["'none'"],
          "form-action": ["'none'"],
        },
      }),
    ],
    server: {
      port: 5173,
      // proxy: {
      //   "/api": {
      //     target: "http://localhost:5232",
      //     changeOrigin: true,
      //     secure: false,
      //     ws: true,
      //   },
      // },
    },
    optimizeDeps: {
      include: ["@emotion/styled"], //MUI material is not compatible with styled() components. So this is to ensure 'emotion/style' is configured to run.
    },
  };
});
