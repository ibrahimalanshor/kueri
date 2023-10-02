export type RawQuery = Record<string, any>;
export type ParsedQuery = Record<string, any>;
export type Sort = Record<string, 'asc' | 'desc'>;
export type Page = {
  size: number;
  number: number;
};
export type Filter = Record<string, any>;
export type Include = string[];

export interface QueryForAll {
  include: Include;
  page: Page;
  sort: Sort;
  filter: Filter;
}
export interface QueryForSingle {
  include: Include;
}
