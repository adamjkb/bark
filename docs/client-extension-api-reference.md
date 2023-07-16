---
description: List of all available methods on an Bark extended Prisma client.
---

# Client Extension API reference

## Good to know

Bark doesn't override any of the existing [Prisma model queries](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries) but it is strongly recommended to create / delete new nodes using the extensions API otherwise the tree structure might not work and require a lot of manual intervention to untangle it. For similar reasons it's best not to directly update `path`, `numchild`, and `depth` properties.

## Extend a Prisma Client

To extend a Prisma Client all you have to is to import Bark and call it with the Bark-compatible models passed into the `modelNames` property. 

```js
import { PrismaClient } from '@prisma/client'
import { bark } from 'prisma-extension-bark'

const xprisma = new PrismaClient().$extends(bark({ modelNames: ['node'] }))
```

## Create

### `createRoot`

Creates a root node if one doesn't exist already or adds a sibling to an already existing one. Returns the newly create node entry.

| Argument  | Required    | Description                                                                                                                       |
| --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `data`    | _**Yes\***_ | Object that will be used to create new record in database.                                                                        |
| `...args` | No          | Same as [`create`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create) options excluding `data`. |

<details>

<summary>Example</summary>

```js
const root = await xprisma.node.createRoot({ data: { name: 'My new root' } })
// { id: 1, path: '0001', depth: 1, numchild: 0, name: 'My new root' }
```

</details>

### `createChild`

Creates a new child to the defined node in either `where` or `node` arguments. Returns the newly create node entry.

| Argument  | Required               | Description                                                                                                                                                                                                    |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                                                                               |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                                                                                                      |
| `data`    | _**Yes\***_            | Object that will be used to create new record in database. Same as [`create.data`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create) except `path`, `depth`, and `numchild` |
| `...args` | No                     | Same as [`create`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create) options excluding `data`.                                                                              |

<details>

<summary>Example</summary>

```js
const futureParent = await xprisma.node.findUnique({ where: { id: 1 }})
const child = await xprisma.node.createChild({
	node: futureParentNode,
	data: { name: 'New born' }, 
	select: { name: true } 
})
// { name: 'New born' }
```

</details>

### `createSibling`

Creates a new sibling to the defined node in either `where` or `node` arguments. The node will be created at after last sibling of the level. Returns the newly create node entry.

| Argument  | Required               | Description                                                                                                                                                                                                    |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                                                                               |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                                                                                                      |
| `data`    | _**Yes\***_            | Object that will be used to create new record in database. Same as [`create.data`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create) except `path`, `depth`, and `numchild` |
| `...args` | No                     | Same as [`create`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create) options excluding `data`.                                                                              |

<details>

<summary>Example</summary>

```js
const aSibling = await xprisma.node.findUnique({ where: { id: 1 }})
const newSibling = await xprisma.node.createSibling({
	node: root,
	data: { name: 'New sibling' }, 
	select: { name: true } 
})
// { name: 'New sibling' }
```

</details>

## Find

### `findTree`

Returns all nodes in tree, including the parent if provided. By default the tree is ordered by `path` in ascending order.

| Argument       | Required | Description                                                                                                                         |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `parent.node`  | No       | An existing node used as a reference where the incoming entry should be created.                                                    |
| `parent.where` | No       | Query to find an existing node to be used as a reference.                                                                           |
| `orderBy`      | No       | Lets you order the returned list by any property. Defaults to `{ path: 'asc' }`                                                     |
| `...args`      | No       | Same as [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) options excluding `where` |

<details>

<summary>Example</summary>

```js
const tree = await xprisma.node.findTree({
	parent: { where: { path: '00010001' } },
	select: { path: true }
})
// [{ path: '00010001' }, { path: '000100010001' }, ...]
```

</details>

### `findAncestors`

Returns all ancestors, from the root node to the parent, of the defined node in either `where` or `node` arguments. If the `findAncestors` called on a root node it will return `null`. By default the tree is ordered by `path` in ascending order.

| Argument  | Required               | Description                                                                                                                                        |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                   |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                                          |
| `orderBy` | No                     | Lets you order the returned list by any property. Defaults to `{ path: 'asc' }`                                                                    |
| `...args` | No                     | Same as [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) options excluding `where` and `orderBy`. |

<details>

<summary>Example</summary>

```js
const ancestors = await xprisma.node.findAncestors({
	where: { path: '0001000100010001' },
	select: { path: true }
})
// [{ path: '0001' }, { path: '00010001' }, { path: '000100010001' }]
```

</details>

### `findDescendants`

Returns all descendants, excluding itself, of the defined node in either `where` or `node` arguments. If the `findDescendants` called on a leaf node it will return `null`. By default the tree is ordered by `path` in ascending order.

| Argument  | Required               | Description                                                                                                                                        |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                   |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                                          |
| `orderBy` | No                     | Lets you order the returned list by any property. Defaults to `{ path: 'asc' }`                                                                    |
| `...args` | No                     | Same as [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) options excluding `where` and `orderBy`. |

<details>

<summary>Example</summary>

```js
const descendants = await xprisma.node.findDescendants({
	where: { path: '0001' },
	select: { path: true }
})
// [{ path: '00010001' }, { path: '000100010001' }, { path: '00010002' }]
```

</details>

### `findParent`

Return the parent node of the defined node in either `where` or `node` arguments. If the `findParent` called on a root node it will return `null`.

| Argument  | Required               | Description                                                                                                                             |
| --------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                        |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                               |
| `...args` | No                     | Same as [`findUnique`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst) options excluding `where`. |

<details>

<summary>Example</summary>

```js
const parent = await prisma.node.findParent({where: { path: '00010002' }, select: { path: true, name: true }})
// { path: '0001', name: 'Root A' }
```

</details>

### `findChildren`

Returns all direct children nodes of the defined node in either `where` or `node` arguments. When no children were found it will return `null`. By default the tree is ordered by `path` in ascending order.

| Argument  | Required               | Description                                                                                                                                        |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                   |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                                          |
| `orderBy` | No                     | Lets you order the returned list by any property. Defaults to `{ path: 'asc' }`                                                                    |
| `...args` | No                     | Same as [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) options excluding `where` and `orderBy`. |

<details>

<summary>Example</summary>

```js
const children = await xprisma.node.findChildren({
	where: { path: '00010001' },
	select: { path: true }
})
// [{ path: '000100010001' }, { path: '000100010002' }, ...]
```

</details>

### `findSiblings`

Returns all sibling nodes, including itself, of the defined node in either `where` or `node` arguments. By default the tree is ordered by `path` in ascending order.

| Argument  | Required               | Description                                                                                                                         |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created.                                                    |
| `where`   | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                                                                           |
| `orderBy` | No                     | Lets you order the returned list by any property. Defaults to `{ path: 'asc' }`                                                     |
| `...args` | No                     | Same as [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) options excluding `where` |

<details>

<summary>Example</summary>

```js
const siblings = await xprisma.node.findSiblings({
	where: { path: '00010001' },
	select: { path: true }
})
// [{ path: '00010001' }, { path: '00010002' }, ...]
```

</details>

### `findLastRoot`

Returns the last root node. If no root node exist it returns `null`.

| Argument  | Required | Description                                                                                                                                          |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `...args` | No       | Same as [`findFirst`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst) options excluding `where` and `orderBy`. |

<details>

<summary>Example</summary>

```js
const lastRootNode = await xprisma.node.findLastRoot({ select: { name: true } })
// { name: 'Root C' }
```

</details>

## Delete

### `deleteNode`

Deletes the node and all its descendants. Returns the count of deleted nodes just like [`deleteMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#deletemany) would.

| Argument | Required               | Description                                                                      |
| -------- | ---------------------- | -------------------------------------------------------------------------------- |
| `node`   | **Yes** unless `where` | An existing node used as a reference where the incoming entry should be created. |
| `where`  | **Yes** unless `node`  | Query to find an existing node to be used as a reference.                        |

<details>

<summary>Example</summary>

```js
const deletedNodesCount = await xprisma.node.deleteNode({ where: { path: '00010001' })
// { count: 6 }
```

</details>

### `deleteManyNodes`

Deletes all matching nodes found by the `where` filter and their descendants using the least number of operations. Returns the count of deleted nodes just like [`deleteMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#deletemany) would. If no nodes were deleted it will return `null`.

| Argument | Required | Description                                                                                                     |
| -------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `where`  | **Yes**  | Same as [`findMany.where`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany) |

<details>

<summary>Example</summary>

```js
const deletedNodesCount = await xprisma.node.deleteManyNodes({ 
	where: { 
		id: {
			in: [9, 3, 10]
		}
	}
})
// { count: 12 }
```

</details>

## Operation

### `move`

Move the node of the defined node in either `where` or `node` arguments relative to the `reference`'s node and the `position` argument. Throws if the targeted node is trying to be moved to own of its descendants, if the node is already in the requested position, or if either the target or the referenced node is not found. Returns `undefined`

| Argument          | Required                         | Description                                                                                            |
| ----------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `node`            | **Yes** unless `where`           | An existing node used as a reference where the incoming entry should be move.                          |
| `where`           | **Yes** unless `node`            | Query to find an existing node to be used as a reference.                                              |
| `position`        | **Yes**                          | One of the following: `first-child`, `last-child`, `first-sibling`, `left`, `right`, or `last-sibling` |
| `reference.node`  | **Yes** unless `reference.where` | An existing node used as a reference point to move.                                                    |
| `reference.where` | **Yes** unless `reference.node`  | Query to find an existing node to be used as a reference.                                              |

<details>

<summary>Example</summary>

```js
const nodeBefore = await xprisma.node.findUnique({where: { id: 9 }})
// { path: '00010001', ... }
await xprisma.node.move({ 
	node: nodeBefore,
	position: 'first-child',
	reference: {
		where: {
			path: '00010002'
		}
	}
})
const nodeAfter = await xprisma.node.findUnique({where: { id: 9 }})
// { path: '000100020001', ... }
```

</details>

### `fixTree` \[TBD]

_Not currently implemented._ [_See issue on GitHub_](https://github.com/adamjkb/bark/issues/26) _to make your voice heard, or have a go at it._

## Helpers \[TBD]

_These would serve as a syntactic sugar to help make repetitive task easier. An example function be `isDescendantOf`, a function that would compare a node to another return true if it's, well, a descendant of it. Let us know what helpers function you'd find useful on the dedicated_ [_GitHub issue_](https://github.com/adamjkb/bark/issues/27)_._
