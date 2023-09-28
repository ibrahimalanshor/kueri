import { Handler, Request, Response, NextFunction, query } from 'express';
import Joi from 'joi';

type Sort = Record<string, 'asc' | 'desc'>;
interface QueryForAll {
  page: {
    size: number;
    number: number;
  };
  filter: {};
  sort: Sort | null;
}

export class QueryMiddleware {
  private schema: Joi.Schema = Joi.object({
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
  });

  private parseSort(sort: string): Sort {
    return Object.fromEntries(
      sort.split(',').map((prop) => {
        const isDesc = prop.charAt(0) === '-';

        return [isDesc ? prop.slice(1) : prop, isDesc ? 'desc' : 'asc'];
      }),
    );
  }

  private parseQueryForAll(query: Record<string, any>): QueryForAll {
    return {
      page: {
        size: Number(query?.page?.size ?? 10),
        number: Number(query?.page?.number ?? 1),
      },
      filter: query.filter ?? {},
      sort: query.sort ? this.parseSort(query.sort) : null,
    };
  }

  forAll(): Handler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.schema.validateAsync(req.query);

        req.query = this.parseQueryForAll(
          req.query as Record<string, any>,
        ) as unknown as Request['query'];

        return next();
      } catch (err) {
        if (err instanceof Joi.ValidationError) {
          return res.status(400).json({
            status: 400,
            title: 'Query Invalid',
            details: {
              [err.details[0].context?.label as string]: err.details[0].message,
            },
          });
        }

        return res.status(500).json(err);
      }
    };
  }
}
