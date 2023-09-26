export interface GetAllOptions {
  paginated?: boolean;
}
export interface PaginatedResource<T> {
  meta: {
    total: number;
  };
  data: T[];
}

export abstract class Resource<T> {
  abstract getAll(options?: GetAllOptions): Promise<T[] | PaginatedResource<T>>;
}
