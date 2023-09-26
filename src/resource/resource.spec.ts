import { describe, expect, test } from '@jest/globals';
import { GetAllOptions, PaginatedResource, Resource } from './resource';

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
    async getAll(
      options?: GetAllOptions,
    ): Promise<User[] | PaginatedResource<User>> {
      if (options?.paginated) {
        return {
          meta: {
            total: users.length,
          },
          data: users,
        };
      }

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

    test('return all paginated data', async () => {
      await expect(
        new UserResource().getAll({ paginated: true }),
      ).resolves.toEqual({
        meta: {
          total: users.length,
        },
        data: users,
      });
    });
  });
});
