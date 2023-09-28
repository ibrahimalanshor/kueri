import Joi, { Schema } from 'joi';
import { QueryParser } from './query-parser';
import { RawQuery, QueryForSingle } from './types';
import { parseInclude } from './query-helper';

export class QueryForSingleParser extends QueryParser<QueryForSingle> {
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
  parse(query: RawQuery): QueryForSingle {
    return {
      include: parseInclude(query.include),
    };
  }
}
