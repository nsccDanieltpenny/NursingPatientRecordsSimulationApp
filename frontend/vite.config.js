import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import cspPlugin from "vite-plugin-csp-guard";

export default defineConfig(({ mode }) => {
  /*global process */
  const env = loadEnv(mode, process.cwd());
  const isProduction = () => mode === "production";
  const toList = (items) => (items || []).filter(Boolean).map(String);

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
          "default-src": toList([isProduction() ? "'none'" : "'self'"]),
          "script-src": toList(["'self'"]),
          "style-src-elem": toList(["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]),
          "img-src": toList(["'self'", "data:", "https://nscc-care-img-fag7f9h6ajf4cbcq.canadacentral-01.azurewebsites.net",
            "https://nscccarestorage.blob.core.windows.net"]),
          "font-src": toList(["'self'", "https://fonts.gstatic.com"]),
          "connect-src": toList([
            "'self'",
            "http://localhost:5232",
            "https://login.microsoftonline.com",
            "http://localhost:7071",
            "https://care-capstone-api-cbc9h7cyb8bcd5au.eastus2-01.azurewebsites.net",
            "https://nscc-care-api-dsaff2hwcbfvdpgb.canadacentral-01.azurewebsites.net",
            "https://nscc-care-img-fag7f9h6ajf4cbcq.canadacentral-01.azurewebsites.net",
            env.VITE_API_URL
          ]),
          "object-src": toList(["'none'"]),
          "base-uri": toList(["'none'"]),
          "form-action": toList(["'none'"]),
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
        "Strict-Transport-Security": "max-age=300; includeSubDomains",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
    optimizeDeps: {
      include: ["@emotion/styled"], // MUI material is not compatible with styled() components.
    },
  };
});