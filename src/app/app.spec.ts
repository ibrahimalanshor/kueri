import { beforeAll, describe, expect, test } from '@jest/globals';
import supertest from 'supertest';
import { App } from './app';

describe('class App', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  });

  test('callable', () => {
    expect(typeof App).toBe('function');
  });

  describe('.listen()', () => {
    test('exists in prototype', () => {
      expect(App.prototype.listen).toBeDefined();
    });
    test('callable', () => {
      expect(typeof App.prototype.listen).toBe('function');
    });
    test('run server', async () => {
      try {
        app.listen();

        await supertest('http://localhost:3000').get('/').expect(404);
      } finally {
        app.stop();
      }
    });
  });
});
