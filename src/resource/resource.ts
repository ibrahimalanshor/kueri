export abstract class Resource<T> {
  abstract getAll(): Promise<T[]>;
}
