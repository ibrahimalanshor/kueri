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
        const offset =
          ((options?.page?.number ?? 1) - 1) * (options?.page?.size ?? 10);
        const data =
          options?.page?.size || offset
            ? users.slice(offset, (options?.page?.size ?? 10) + offset)
            : users;

        return {
          meta: {
            total: users.length,
          },
          data: data,
        };
      }

      const data =
        options?.limit || options?.offset
          ? users.slice(
              options?.offset ?? 0,
              (options?.limit ?? 10) + (options?.offset ?? 0),
            )
          : users;

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

    test('return offseted and limited', async () => {
      const data = (await new UserResource().getAll({
        limit: 1,
        offset: 1,
      })) as User[];

      expect(data[0]).toEqual(users[1]);
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

      test('return limited page 2', async () => {
        const data = (await new UserResource().getAll({
          paginated: true,
          page: {
            size: 1,
            number: 2,
          },
        })) as PaginatedResource<User>;

        expect(data.data[0]).toEqual(users[1]);
      });
    });
  });
});
