import { describe, expect, test } from '@jest/globals';
import { QueryMiddleware } from '../query-middleware';
import { createServer } from '../../helpers/server';
import supertest from 'supertest';
import { Application, Handler, Request, Response } from 'express';

function createTestServer(handler: Handler): Application {
  const server = createServer();

  server.get('/', handler, (req: Request, res: Response) =>
    res.status(200).json(req.query),
  );

  return server;
}

describe('QueryMiddleware.prototype.forAll', () => {
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
      const server = createTestServer(new QueryMiddleware().forAll());

      const res = await supertest(server).get('/').expect(200);

      expect(res.body).toEqual({
        page: {
          number: 1,
          size: 10,
        },
      });
    });

    test('page query nan return 400', async () => {
      const server = createTestServer(new QueryMiddleware().forAll());

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
        const server = createTestServer(new QueryMiddleware().forAll());

        const res = await supertest(server)
          .get('/')
          .query({
            page: {},
          })
          .expect(200);

        expect(res.body).toEqual({
          page: {
            number: 1,
            size: 10,
          },
        });
      });

      test('page.number nan return 400', async () => {
        const server = createTestServer(new QueryMiddleware().forAll());

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
        const server = createTestServer(new QueryMiddleware().forAll());

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
        const server = createTestServer(new QueryMiddleware().forAll());

        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              number: 5,
            },
          })
          .expect(200);

        expect(res.body).toEqual({
          page: {
            number: 5,
            size: 10,
          },
        });
      });
    });

    // page size
    describe('page.size', () => {
      test('no page.size return 200', async () => {
        const server = createTestServer(new QueryMiddleware().forAll());

        const res = await supertest(server)
          .get('/')
          .query({
            page: {},
          })
          .expect(200);

        expect(res.body).toEqual({
          page: {
            number: 1,
            size: 10,
          },
        });
      });

      test('page.size nan return 400', async () => {
        const server = createTestServer(new QueryMiddleware().forAll());

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
        const server = createTestServer(new QueryMiddleware().forAll());

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
        const server = createTestServer(new QueryMiddleware().forAll());

        const res = await supertest(server)
          .get('/')
          .query({
            page: {
              size: 50,
            },
          })
          .expect(200);

        expect(res.body).toEqual({
          page: {
            number: 1,
            size: 50,
          },
        });
      });
    });
  });
});
