import Joi, { Schema } from 'joi';
import { QueryParser } from './query-parser';
import { Page, Sort, Filter, Include, RawQuery, QueryForAll } from './types';

export class QueryForAllParser extends QueryParser<QueryForAll> {
  schema(): Schema {
    return Joi.object({
      page: Joi.object({
        number: Joi.number().positive().messages({
          'number.base': 'page number must be a number',
          'number.positive': 'page number must be a positive number',
        }),
        size: Joi.number().positive().messages({
          'number.base': 'page size must be a number',
          'number.positive': 'page size must be a positive number',
        }),
      }).messages({
        'object.base': 'page must be an object',
      }),
      filter: Joi.object().messages({
        'object.base': 'filter must be an object',
      }),
      sort: Joi.string().messages({
        'string.base': 'sort must be a string',
      }),
      include: Joi.string().messages({
        'string.base': 'include must be a string',
      }),
    });
  }
  parse(query: RawQuery): QueryForAll {
    return {
      page: this.parsePage(query.page),
      include: this.parseInclude(query.include),
      sort: this.parseSort(query.sort),
      filter: this.parseFilter(query.filter),
    };
  }

  private parsePage(page?: Record<string, number>): Page {
    return {
      size: Number(page?.size ?? 10),
      number: Number(page?.number ?? 1),
    };
  }

  private parseInclude(include?: string): Include {
    return include ? include.split(',') : [];
  }

  private parseSort(sort?: string): Sort {
    return sort
      ? Object.fromEntries(
          sort.split(',').map((prop) => {
            const isDesc = prop.charAt(0) === '-';

            return [isDesc ? prop.slice(1) : prop, isDesc ? 'desc' : 'asc'];
          }),
        )
      : {};
  }

  private parseFilter(filter?: Record<string, number>): Filter {
    return filter ?? {};
  }
}
