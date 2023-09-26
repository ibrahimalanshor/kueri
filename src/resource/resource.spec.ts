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
      const userData = options?.filter
        ? users.filter((user) => user.id === options?.filter?.id)
        : [...users];

      if (options?.sort) {
        userData.sort((user, nextUser) => nextUser.id - user.id);
      }

      if (options?.paginated) {
        const offset =
          ((options?.page?.number ?? 1) - 1) * (options?.page?.size ?? 10);
        const data =
          options?.page?.size || offset
            ? userData.slice(offset, (options?.page?.size ?? 10) + offset)
            : userData;

        return {
          meta: {
            total: userData.length,
          },
          data: data,
        };
      }

      const data =
        options?.limit || options?.offset
          ? userData.slice(
              options?.offset ?? 0,
              (options?.limit ?? 10) + (options?.offset ?? 0),
            )
          : userData;

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

    test('return sorted', async () => {
      const data = (await new UserResource().getAll({ sort: '-id' })) as User[];

      expect(data[0]).toEqual(users[users.length - 1]);
    });

    test('return filtered', async () => {
      const data = (await new UserResource().getAll({
        filter: { id: 2 },
      })) as User[];

      expect(data).toHaveLength(1);
      expect(data[0].id).toEqual(2);
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
