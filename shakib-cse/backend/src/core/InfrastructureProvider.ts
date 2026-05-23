export interface InfrastructureProvider<T = any> {
  name: string;

  /** Returns the actual underlying client (e.g., PrismaClient, Redis) */
  getClient(): T;

  /** Called when the server boots. Open sockets or validate API keys here. */
  connect(): Promise<void>;

  /** Called during graceful shutdown. Close sockets here. */
  disconnect(): Promise<void>;
}
