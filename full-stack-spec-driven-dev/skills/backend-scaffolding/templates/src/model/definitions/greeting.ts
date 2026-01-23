// Model Definition: Greeting
// Domain type representing a personalized greeting

export type Greeting = {
  readonly id: string;
  readonly name: string;
  readonly message: string;
  readonly createdAt: Date;
};

export type CreateGreetingInput = {
  readonly name: string;
};
