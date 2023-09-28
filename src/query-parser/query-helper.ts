import { Page, Include, Sort, Filter } from './types';

export function parsePage(page?: Record<string, number>): Page {
  return {
    size: Number(page?.size ?? 10),
    number: Number(page?.number ?? 1),
  };
}

export function parseInclude(include?: string): Include {
  return include ? include.split(',') : [];
}

export function parseSort(sort?: string): Sort {
  return sort
    ? Object.fromEntries(
        sort.split(',').map((prop) => {
          const isDesc = prop.charAt(0) === '-';

          return [isDesc ? prop.slice(1) : prop, isDesc ? 'desc' : 'asc'];
        }),
      )
    : {};
}

export function parseFilter(filter?: Record<string, number>): Filter {
  return filter ?? {};
}
