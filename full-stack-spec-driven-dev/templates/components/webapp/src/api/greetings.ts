// Model: Greetings API
// API layer for greeting operations - matches OpenAPI contract
const API_BASE = '/api/v1';

export type Greeting = {
  readonly id: string;
  readonly name: string;
  readonly message: string;
  readonly createdAt: string;
};

export type CreateGreetingInput = {
  readonly name: string;
};

export type ApiError = {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
};

export const greetingsApi = {
  create: async (input: CreateGreetingInput): Promise<Greeting> => {
    const response = await fetch(`${API_BASE}/greetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  },

  getById: async (id: string): Promise<Greeting> => {
    const response = await fetch(`${API_BASE}/greetings/${id}`);

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  },
};
