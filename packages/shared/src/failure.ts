export interface Failure<Code extends string> {
  code: Code;
  message: string;
  detail?: unknown;
}
