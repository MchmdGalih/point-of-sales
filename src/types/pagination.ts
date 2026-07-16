export type PaginationMeta = {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
};

export type PaginationResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
