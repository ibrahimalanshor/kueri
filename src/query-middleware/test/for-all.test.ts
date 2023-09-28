import { beforeAll, describe, expect, test } from '@jest/globals';
import { QueryMiddleware } from '../query-middleware';
import { createServer } from '../../helpers/server';
import supertest from 'supertest';
import { Application, Handler, Request, Response } from 'express';

describe('QueryMiddleware.prototype.forAll', () => {
  const server = createServer();

  server.get(
    '/',
    new QueryMiddleware().forAll(),
    (req: Request, res: Response) => res.status(200).json(req.query),
  );

  test('callable', () => {
    expect(QueryMiddleware.prototype.forAll).toBeDefined();
    expect(typeof QueryMiddleware.prototype.forAll).toBe('function');
  });

  test('return handler', () => {
    expect(typeof new QueryMiddleware().forAll()).toBe('function');
  });

  // page
  describe('page', () => {
    test('no page query return 200', async () => {
      const res = await supertest(server).get('/').expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          page: {
            number: 1,
            size: 10,
          },
        }),
      );
    });

    test('page query is not object return 400', async () => {
      const res = await supertest(server)
        .get('/')
        .query({
          page: 'invalid',
        })
        .expect(400);

      expect(res.body).toEqual({
        status: 400,
        title: 'Query Invalid',
        details: {
          page: 'page must be an object',
        },
      });
    });

    // page number
    describe('page.number', () => {
      test('no page.number return 200', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {},
          })
          .expect(200);

        expect(res.body).toEqual(
          expect.objectContaining({
            page: {
              number: 1,
              size: 10,
            },
          }),
        );
      });

      test('page.number nan return 400', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              number: 'test',
            },
          })
          .expect(400);

        expect(res.body).toEqual({
          status: 400,
          title: 'Query Invalid',
          details: {
            'page.number': 'page number must be a number',
          },
        });
      });

      test('page.number negative return 400', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              number: -5,
            },
          })
          .expect(400);

        expect(res.body).toEqual({
          status: 400,
          title: 'Query Invalid',
          details: {
            'page.number': 'page number must be a positive number',
          },
        });
      });

      test('page.number return valid', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              number: 5,
            },
          })
          .expect(200);

        expect(res.body).toEqual(
          expect.objectContaining({
            page: {
              number: 5,
              size: 10,
            },
          }),
        );
      });
    });

    // page size
    describe('page.size', () => {
      test('no page.size return 200', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {},
          })
          .expect(200);

        expect(res.body).toEqual(
          expect.objectContaining({
            page: {
              number: 1,
              size: 10,
            },
          }),
        );
      });

      test('page.size nan return 400', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              size: 'test',
            },
          })
          .expect(400);

        expect(res.body).toEqual({
          status: 400,
          title: 'Query Invalid',
          details: {
            'page.size': 'page size must be a number',
          },
        });
      });

      test('page.size negative return 400', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              size: -5,
            },
          })
          .expect(400);

        expect(res.body).toEqual({
          status: 400,
          title: 'Query Invalid',
          details: {
            'page.size': 'page size must be a positive number',
          },
        });
      });

      test('page.size return valid', async () => {
        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              size: 50,
            },
          })
          .expect(200);

        expect(res.body).toEqual(
          expect.objectContaining({
            page: {
              number: 1,
              size: 50,
            },
          }),
        );
      });
    });
  });

  // filter
  describe('filter', () => {
    test('no filter query return 200', async () => {
      const res = await supertest(server).get('/').expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          filter: {},
        }),
      );
    });

    test('filter is not object return 400', async () => {
      const res = await supertest(server)
        .get('/')
        .query({ filter: 'invalid' })
        .expect(400);

      expect(res.body).toEqual({
        status: 400,
        title: 'Query Invalid',
        details: {
          filter: 'filter must be an object',
        },
      });
    });

    test('filter return valid', async () => {
      const res = await supertest(server)
        .get('/')
        .query({
          filter: {
            name: 'test',
          },
        })
        .expect(200);

      expect(res.body).toEqual(
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
    test('no sort sort return 200', async () => {
      const res = await supertest(server).get('/').expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          sort: null,
        }),
      );
    });

    test('sort is not object return 400', async () => {
      const res = await supertest(server)
        .get('/')
        .query({ sort: [1, 2, 3] })
        .expect(400);

      expect(res.body).toEqual({
        status: 400,
        title: 'Query Invalid',
        details: {
          sort: 'sort must be a string',
        },
      });
    });

    test('sort return valid', async () => {
      const res = await supertest(server)
        .get('/')
        .query({
          sort: 'name',
        })
        .expect(200);

      expect(res.body).toEqual(
        expect.objectContaining({
          sort: 'name',
        }),
      );
    });
  });
});
