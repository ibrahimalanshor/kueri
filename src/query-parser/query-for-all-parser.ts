import Joi, { Schema } from 'joi';
import { QueryParser } from './query-parser';
import { RawQuery, QueryForAll } from './types';
import {
  parsePage,
  parseInclude,
  parseSort,
  parseFilter,
} from './query-helper';

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
      page: parsePage(query.page),
      include: parseInclude(query.include),
      sort: parseSort(query.sort),
      filter: parseFilter(query.filter),
    };
  }
}
