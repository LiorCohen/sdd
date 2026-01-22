// src/index.ts - THE ONLY FILE WITH SIDE EFFECTS (exception to index.ts rule for entry points)
// IMPORTANT: Telemetry must be imported FIRST before any other imports
import './telemetry';
import { createApp } from './app';
import { loadConfig } from './config';
import { createDatabase } from './db';

const main = async (): Promise<void> => {
  const config = loadConfig();
  const db = createDatabase(config);
  const app = createApp({ config, db });
  await app.start();
};

main().catch((error) => {
  console.error('Failed to start app:', error);
  process.exit(1);
});
