import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", //This makes the development server accessible on all network interfaces, not just `localhost`. It allows other devices on the same network to access the server using the machine's IP address.
    port: 5173, // Specifies the port on which the development server will run.
    // open: true,      // Automatically opens the application in the default web browser when the server starts.
    strictPort: true, // Ensures that if the specified port (5173) is already in use, the server will not start and will instead throw an error. This prevents Vite from automatically switching to a different port.
    cors: true, // Enables Cross-Origin Resource Sharing (CORS) for the development server, allowing resources to be requested from different domains.
    // allowedHosts: ["poetic-uniformly-jackal.ngrok-free.app"],
  },
});
