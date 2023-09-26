export interface GetAllOptions {
  paginated?: boolean;
  limit?: number;
  offset?: number;
  page?: {
    size?: number;
    number?: number;
  };
  sort?: string;
  filter?: Record<string, any>;
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
