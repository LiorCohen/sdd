import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { Server } from 'node:http';
import { randomUUID } from 'node:crypto';
import type { Config } from '../config';
import { createController } from '../controller';
import { findGreetingById, insertGreeting } from '../dal';
import type { Database } from '../db';

type AppDependencies = Readonly<{
  readonly config: Config;
  readonly db: Database;
}>;

type App = Readonly<{
  readonly start: () => Promise<void>;
  readonly stop: () => Promise<void>;
}>;

export const createApp = (deps: AppDependencies): App => {
  const { config, db } = deps;

  let server: Server | null = null;
  const app: Express = express();

  // Wire DAL functions with their dependencies
  const dalDeps = { db, generateId: randomUUID };
  const dal = {
    findGreetingById: (id: string) => findGreetingById(dalDeps, id),
    insertGreeting: (input: Parameters<typeof insertGreeting>[1]) =>
      insertGreeting(dalDeps, input),
  };

  // Create controller with DAL dependencies
  const controller = createController({ dal });

  // Middleware
  app.use(express.json());

  // Health check endpoints (infrastructure, not in OpenAPI)
  app.get('/health', (_req: Request, res: Response) => {
    res.json(controller.handleHealth());
  });
  app.get('/readiness', (_req: Request, res: Response) => {
    res.json(controller.handleReadiness());
  });
  app.get('/liveness', (_req: Request, res: Response) => {
    res.json(controller.handleLiveness());
  });

  // Mount API routes
  app.use('/api/v1', controller.router);

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  });

  const start = async (): Promise<void> => {
    return new Promise((resolve) => {
      server = app.listen(config.port, () => {
        console.log(`App listening on port ${config.port}`);
        resolve();
      });
    });
  };

  const stop = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!server) {
        resolve();
        return;
      }
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('App stopped');
        resolve();
      });
    });
  };

  return { start, stop };
};
