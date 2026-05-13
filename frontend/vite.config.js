import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import cspPlugin from "vite-plugin-csp-guard";
import { definePolicy, self, none, unsafeInline, data } from "csp-toolkit";

const contentSecurityPolicy = (apiUrl) =>
  definePolicy({
    defaultSrc: [none],
    scriptSrc: [self],
    styleSrcElem: [
      self,
      unsafeInline, // Required for MUI and Emotion packages (https://vite-csp.tsotne.co.uk/guides/spa#caveats)
      "https://fonts.googleapis.com",
    ],
    imgSrc: [
      self,
      data, // Required for some injected icons
    ],
    fontSrc: [self, "https://fonts.gstatic.com"],
    connectSrc: [
      self,
      "https://login.microsoftonline.com",
      apiUrl, // Allow to connect to the api url
    ],
    objectSrc: [none],
    baseUri: [none],
    formAction: [none],
  });

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
        build: {
          sri: true,
        },
        policy: contentSecurityPolicy(env.VITE_API_URL),
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
