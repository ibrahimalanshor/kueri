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

  describe('.prototype.listen', () => {
    test('exists', () => {
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

  describe('.prototype.setPort', () => {
    test('exist', () => {
      expect(App.prototype.setPort).toBeDefined();
    });
    test('callable', () => {
      expect(typeof App.prototype.listen).toBe('function');
    });
    test('listen to new port', async () => {
      try {
        app.setPort(5000);
        app.listen();

        await supertest('http://localhost:5000').get('/').expect(404);
      } finally {
        app.stop();
      }
    });
  });
});
