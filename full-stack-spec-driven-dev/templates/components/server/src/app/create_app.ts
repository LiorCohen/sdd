import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import type { Server } from 'node:http';
import { randomUUID } from 'node:crypto';
import type { Config } from '../config';
import { createController } from '../controller';
import type { Greeting, CreateGreetingInput } from '../model';

type AppDependencies = Readonly<{
  readonly config: Config;
}>;

type App = Readonly<{
  readonly start: () => Promise<void>;
  readonly stop: () => Promise<void>;
}>;

export const createApp = (deps: AppDependencies): App => {
  const { config } = deps;

  let server: Server | null = null;
  const app: Express = express();

  // In-memory store for demo purposes
  // In production, replace with actual database (PostgreSQL, etc.)
  const greetingsStore = new Map<string, Greeting>();

  // Create DAL functions that use the in-memory store
  const dal = {
    findGreetingById: async (id: string): Promise<Greeting | null> => {
      return greetingsStore.get(id) ?? null;
    },
    insertGreeting: async (
      input: CreateGreetingInput & { readonly message: string }
    ): Promise<Greeting> => {
      const greeting: Greeting = {
        id: randomUUID(),
        name: input.name,
        message: input.message,
        createdAt: new Date(),
      };
      greetingsStore.set(greeting.id, greeting);
      return greeting;
    },
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
