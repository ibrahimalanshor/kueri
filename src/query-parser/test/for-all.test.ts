import { describe, expect, test } from '@jest/globals';
import { QueryForAllParser } from '../query-for-all-parser';
import { ValidationError } from '../../errors/validation.error';

describe('QueryForAllParser.prototype.make', () => {
  test('callable', () => {
    expect(QueryForAllParser.prototype.make).toBeDefined();
    expect(typeof QueryForAllParser.prototype.make).toBe('function');
  });

  test('return promise', () => {
    expect(new QueryForAllParser().make({})).toBeInstanceOf(Promise);
  });

  // page
  describe('page', () => {
    test('return default', async () => {
      await expect(new QueryForAllParser().make({})).resolves.toEqual(
        expect.objectContaining({
          page: {
            number: 1,
            size: 10,
          },
        }),
      );
    });

    test('must be an object', async () => {
      await expect(
        new QueryForAllParser().make({
          page: 'invalid',
        }),
      ).rejects.toThrow(ValidationError);
      await expect(
        new QueryForAllParser().make({
          page: 'invalid',
        }),
      ).rejects.toThrow('page must be an object');
    });

    // page number
    describe('page.number', () => {
      test('return default', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {},
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            page: {
              number: 1,
              size: 10,
            },
          }),
        );
      });

      test('must be a number', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {
              number: 'test',
            },
          }),
        ).rejects.toThrow(ValidationError);
        await expect(
          new QueryForAllParser().make({
            page: {
              number: 'test',
            },
          }),
        ).rejects.toThrow('page number must be a number');
      });

      test('must be a positive number', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {
              number: -5,
            },
          }),
        ).rejects.toThrow(ValidationError);
        await expect(
          new QueryForAllParser().make({
            page: {
              number: -5,
            },
          }),
        ).rejects.toThrow('page number must be a positive number');
      });

      test('return page number', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {
              number: 5,
            },
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            page: {
              number: 5,
              size: 10,
            },
          }),
        );
      });
    });

    // page suze
    describe('page.size', () => {
      test('return default', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {},
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            page: {
              number: 1,
              size: 10,
            },
          }),
        );
      });

      test('must be a number', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {
              size: 'test',
            },
          }),
        ).rejects.toThrow(ValidationError);
        await expect(
          new QueryForAllParser().make({
            page: {
              size: 'test',
            },
          }),
        ).rejects.toThrow('page size must be a number');
      });

      test('must be a positive number', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {
              size: -5,
            },
          }),
        ).rejects.toThrow(ValidationError);
        await expect(
          new QueryForAllParser().make({
            page: {
              size: -5,
            },
          }),
        ).rejects.toThrow('page size must be a positive number');
      });

      test('return page size', async () => {
        await expect(
          new QueryForAllParser().make({
            page: {
              size: 5,
            },
          }),
        ).resolves.toEqual(
          expect.objectContaining({
            page: {
              size: 5,
              number: 1,
            },
          }),
        );
      });
    });
  });

  // filter
  describe('filter', () => {
    test('return default', async () => {
      await expect(
        new QueryForAllParser().make({
          filter: {},
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          filter: {},
        }),
      );
    });

    test('must be an object', async () => {
      await expect(
        new QueryForAllParser().make({
          filter: 'invalid',
        }),
      ).rejects.toThrow(ValidationError);
      await expect(
        new QueryForAllParser().make({
          filter: 'invalid',
        }),
      ).rejects.toThrow('filter must be an object');
    });

    test('return filter', async () => {
      await expect(
        new QueryForAllParser().make({
          filter: { name: 'test' },
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          filter: {
            name: 'test',
          },
        }),
      );
    });
  });

  // sort
  describe('sort', () => {
    test('return default', async () => {
      await expect(new QueryForAllParser().make({})).resolves.toEqual(
        expect.objectContaining({
          sort: {},
        }),
      );
    });

    test('must be a string', async () => {
      await expect(
        new QueryForAllParser().make({ sort: [1, 2, 3] }),
      ).rejects.toThrow(ValidationError);
      await expect(
        new QueryForAllParser().make({ sort: [1, 2, 3] }),
      ).rejects.toThrow('sort must be a string');
    });

    test('return sort', async () => {
      await expect(
        new QueryForAllParser().make({
          sort: '-name,age',
        }),
      ).resolves.toEqual(
        expect.objectContaining({
          sort: {
            name: 'desc',
            age: 'asc',
          },
        }),
      );
    });
  });

  // include
  describe('include', () => {
    test('return default', async () => {
      await expect(new QueryForAllParser().make({})).resolves.toEqual(
        expect.objectContaining({
          include: [],
        }),
      );
    });

    test('must be a string', async () => {
      await expect(
        new QueryForAllParser().make({ include: [1, 2, 3] }),
      ).rejects.toThrow(ValidationError);
      await expect(
        new QueryForAllParser().make({ include: [1, 2, 3] }),
      ).rejects.toThrow('include must be a string');
    });

    test('return include', async () => {
      await expect(
        new QueryForAllParser().make({
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
