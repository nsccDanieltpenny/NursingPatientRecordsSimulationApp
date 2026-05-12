import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import csp from "vite-plugin-csp-guard";

export default defineConfig({
  plugins: [
    react(),
    // Content Security Policy
    // OWASP cheat sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
    // Plugin docs: https://vite-csp.tsotne.co.uk/
    csp({
      algorithm: "sha256",
      dev: {
        run: true,
      },
      policy: {
        "script-src": ["'self'"],
        "style-src-elem": [
          "'self'",
          "'unsafe-inline'", // Required for MUI and Emotion packages (https://vite-csp.tsotne.co.uk/guides/spa#caveats)
          "https://fonts.googleapis.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "connect-src": [
          "'self'",
          "http://localhost:5232",
          "https://login.microsoftonline.com",
        ],
        "img-src": [
          "'self'",
          "data:", // Required for some injected icons
        ],
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
    headers: {
      // HTTP Security headers (https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
      "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Strict-Transport-Security": "max-age=300; includeSubDomains", // Adds HSTS options, with a expiry time of 5 minutes for testing and development (https://hstspreload.org/)
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-Robots-Tag": "noindex, nofollow",
    },
  },
  optimizeDeps: {
    include: ["@emotion/styled"], //MUI material is not compatible with styled() components. So this is to ensure 'emotion/style' is configured to run.
  },
});
