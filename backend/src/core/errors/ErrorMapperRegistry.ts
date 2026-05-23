import { AppError } from "./AppError";

export type ErrorMapper = (err: unknown) => AppError | undefined | null;

class ErrorMapperRegistry {
  private mappers: ErrorMapper[] = [];

  /**
   * Register a new custom error mapper from an infrastructure provider
   */
  public register(mapper: ErrorMapper): void {
    this.mappers.push(mapper);
  }

  /**
   * Run the error through all registered mappers
   */
  public map(err: unknown): AppError | null {
    for (const mapper of this.mappers) {
      const mappedError = mapper(err);
      if (mappedError) {
        return mappedError; // Return the first successful mapping
      }
    }
    return null;
  }
}

// Export a singleton instance
export const errorMapperRegistry = new ErrorMapperRegistry();
