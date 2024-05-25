import type { Cache, CacheValue } from "./interfaces/cache";

export class MemoCache<T> implements Cache<T> {
  private cache: Record<string, CacheValue<T>>;

  constructor() {
    this.cache = {};
  }

  public addItem(key: string, data: T, timestamp?: number): void {
    this.cache[key] = { data, timestamp: Date.now() + (timestamp || 10000) };
  }

  public getItem(key: string): CacheValue<T> {
    return this.cache[key];
  }
}
