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
    {
      id: 3,
      name: 'another',
    },
  ];

  class UserResource extends Resource<User> {
    async getAll(
      options?: GetAllOptions,
    ): Promise<User[] | PaginatedResource<User>> {
      if (options?.paginated) {
        const data = options?.page?.size
          ? users.slice(0, options?.page?.size)
          : users;

        return {
          meta: {
            total: users.length,
          },
          data: data,
        };
      }

      const data = options?.limit ? users.slice(0, options?.limit) : users;

      return data;
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

    test('return all', async () => {
      await expect(new UserResource().getAll()).resolves.toEqual(users);
    });

    test('return limited', async () => {
      const data = await new UserResource().getAll({ limit: 1 });

      expect(data).toHaveLength(1);
    });

    describe('paginated', () => {
      test('return all paginated', async () => {
        await expect(
          new UserResource().getAll({ paginated: true }),
        ).resolves.toEqual({
          meta: {
            total: users.length,
          },
          data: users,
        });
      });

      test('return limited per page', async () => {
        const data = (await new UserResource().getAll({
          paginated: true,
          page: {
            size: 1,
          },
        })) as PaginatedResource<User>;

        expect(data.data).toHaveLength(1);
      });
    });
  });
});
