import { describe, expect, test } from '@jest/globals';
import { Resource } from './resource';

describe.only('class Resource', () => {
  interface User {
    id: number;
    name: string;
  }

  const users: User[] = [
    {
      id: 1,
      name: 'test',
    },
    {
      id: 2,
      name: 'user',
    },
  ];

  class UserResource extends Resource<User> {
    async getAll(): Promise<User[]> {
      return users;
    }
  }

  describe('.prototype.getAll', () => {
    test('exists', () => {
      expect(UserResource.prototype.getAll).toBeDefined();
    });

    test('callable', () => {
      expect(typeof UserResource.prototype.getAll).toBe('function');
    });

    test('return promise', () => {
      expect(new UserResource().getAll()).toBeInstanceOf(Promise);
    });

    test('return all data', async () => {
      await expect(new UserResource().getAll()).resolves.toEqual(users);
    });
  });
});
