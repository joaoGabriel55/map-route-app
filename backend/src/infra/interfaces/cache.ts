export type CacheValue<T> = { data: T; timestamp: number } | null;

export interface Cache<T> {
  addItem(key: string, data: T, timestamp?: number): void;

  getItem(key: string): CacheValue<T>;
}
