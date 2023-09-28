import Joi, { Schema } from 'joi';
import { ParsedQuery, RawQuery } from './types';
import { ValidationError } from '../errors/validation.error';

export abstract class QueryParser<T extends ParsedQuery> {
  abstract schema(): Schema;
  abstract parse(query: RawQuery): T;

  async make(query: RawQuery): Promise<T> {
    const validated = await this.validate(query);

    return this.parse(validated);
  }

  async validate(query: RawQuery): Promise<T> {
    try {
      return await this.schema().validateAsync(query);
    } catch (err) {
      if (err instanceof Joi.ValidationError) {
        throw new ValidationError({
          name: 'ValidationError',
          message: err.details[0].message,
        });
      }

      throw new ValidationError({
        name: 'ValidationError',
        message: 'Validation Error',
      });
    }
  }
}
