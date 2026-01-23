// src/index.ts - Entry point (exception to index.ts rule for entry points)
import { createApp } from "./app";
import { loadConfig } from "./config";

const main = async (): Promise<void> => {
    const config = loadConfig();
    const app = createApp({ config });
    await app.start();
};

main().catch((error) => {
    console.error("Failed to start app:", error);
    process.exit(1);
});
