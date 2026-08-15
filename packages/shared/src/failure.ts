export type Failure<Code extends string> = {
  code: Code;
  message: string;
  detail?: unknown;
};
