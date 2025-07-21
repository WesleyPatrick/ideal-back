export interface PaginatedEntity<T> {
  data: T[];
  page: number;
  total: number;
  lastPage: number;
}

export interface PaginatedParams {
  page?: number;
  pageSize?: number;
}
