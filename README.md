# kueri

```ts
import { QueryForAllParser } from 'kueri';

const parsed = new QueryForAllParser().make({
  page: {
    number: 1,
    size: 10,
  },
  sort: '-id,name',
  include: 'profile,details',
  filter: {
    isVerified: true,
  },
});

// {
//     page: {
//         size: 1,
//         number: 10
//     },
//     sort: {
//         id: 'DESC',
//         name: 'ASC'
//     },
//     include: ['profile', 'details'],
//     filter: {
//         isVerified: true
//     }
// }
```

```ts
import { QueryForSingleParser } from 'kueri';

const parsed = new QueryForSingleParser().make({
  include: 'profile,details',
});

// {
//     include: ['profile', 'details']
// }
```
