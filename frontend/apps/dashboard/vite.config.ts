import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@cinemax/ui": path.resolve(__dirname, "../../libs/ui/src/index.ts"),
      "@cinemax/ui/lib/utils": path.resolve(__dirname, "../../libs/ui/src/lib/utils.ts"),
      "@cinemax/shared": path.resolve(__dirname, "../../libs/shared/src/index.ts"),
    },
  },
  server: {
    port: 4200,
    host: "0.0.0.0",
  },
})
