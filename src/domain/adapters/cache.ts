export abstract class CacheAdapter {
  abstract set(key: string, value: string, expiryIn: number): Promise<void>; // expiryIn: segundos
  abstract get(key: string): Promise<string | null>;
  abstract delete(key: string): Promise<void>;
}
