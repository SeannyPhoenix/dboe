export class DatabaseError extends Error {
  private _cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
    this._cause = cause;
  }

  get cause(): unknown {
    return this._cause;
  }

  get message(): string {
    if (this._cause instanceof Error) {
      return `${super.message}\nCaused by: ${this._cause.message}`;
    }
    return super.message;
  }

  get stack(): string | undefined {
    if (this._cause instanceof Error) {
      return `${super.stack}\nCaused by: ${this._cause.stack}`;
    }
    return super.stack;
  }
}
