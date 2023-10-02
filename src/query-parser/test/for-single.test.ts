import { describe, expect, test } from '@jest/globals';
import { QueryForSingleParser } from '../query-for-single-parser';
import { ValidationError } from '../../errors/validation.error';

describe('QueryForSingleParser.prototype.make', () => {
  test('callable', () => {
    expect(QueryForSingleParser.prototype.make).toBeDefined();
    expect(typeof QueryForSingleParser.prototype.make).toBe('function');
  });

  test('return promise', () => {
    expect(new QueryForSingleParser().make({})).toBeInstanceOf(Promise);
  });

  // include
  describe('include', () => {
    test('return default', async () => {
      await expect(new QueryForSingleParser().make({})).resolves.toEqual(
        expect.objectContaining({
          include: [],
        }),
      );
    });

    test('must be a string', async () => {
      await expect(
        new QueryForSingleParser().make({ include: [1, 2, 3] }),
      ).rejects.toThrow(ValidationError);
      await expect(
        new QueryForSingleParser().make({ include: [1, 2, 3] }),
      ).rejects.toThrow('include must be a string');
    });

    test('return include', async () => {
      await expect(
        new QueryForSingleParser().make({
          include: 'project,articles',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          include: ['project', 'articles'],
        }),
      );
    });
  });
});
