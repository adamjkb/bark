# prisma-extension-bark

## 1.0.0-next.2

### Patch Changes

- Update prisma client exports ([#88](https://github.com/adamjkb/bark/pull/88))

## 1.0.0-next.1

### Patch Changes

- Fix internal utils import paths ([#93](https://github.com/adamjkb/bark/pull/93))

## 1.0.0-next.0

### Major Changes

- Migrate find methods to use `node` arguments to query instead of `where` ([#91](https://github.com/adamjkb/bark/pull/91))

- Migrate `deleteNode` to use `node` arguments to query instead of `where` ([#91](https://github.com/adamjkb/bark/pull/91))

- Remove redundant `findTree` method ([#91](https://github.com/adamjkb/bark/pull/91))

- Migrate `move` to use `node` and `referenceNode` arguments ([#91](https://github.com/adamjkb/bark/pull/91))

### Minor Changes

- Return null if specified node doesn't return any result instead of throwing an error. ([#91](https://github.com/adamjkb/bark/pull/91))

### Patch Changes

- Select relevant columns whenever node is querying database ([#91](https://github.com/adamjkb/bark/pull/91))

- Migrate `createChild` and `createSibling` to use `node` to find reference node. ([#91](https://github.com/adamjkb/bark/pull/91))

## 0.2.2

### Patch Changes

- Fix typescript import that prevented extension methods to be exposed. ([Issue #78](https://github.com/adamjkb/bark/issues/78)) ([#79](https://github.com/adamjkb/bark/pull/79))

## 0.2.1

### Patch Changes

- Fix an issue in move operation where `numchild` fields were not always updated. ([Issue #68](https://github.com/adamjkb/bark/issues/68)) ([#69](https://github.com/adamjkb/bark/pull/69))

## 0.2.0

### Minor Changes

- CJS support ([#63](https://github.com/adamjkb/bark/pull/63))

## 0.1.1

### Patch Changes

- Improved concurrency handling by relying on [`Prisma.$transactions`](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#transaction-api) ([#54](https://github.com/adamjkb/bark/pull/54))

## 0.1.0

### Minor Changes

- Initial public release ([#47](https://github.com/adamjkb/bark/pull/47))

### Patch Changes

- Rename Rename extension function to `withBark` ([#42](https://github.com/adamjkb/bark/pull/42))

- Upgraded Prisma to v5.0.0 ([#38](https://github.com/adamjkb/bark/pull/38))

- Added README to package ([#35](https://github.com/adamjkb/bark/pull/35))

- - Fix package.json definitions ([#40](https://github.com/adamjkb/bark/pull/40))
  - Improved user-facing Typescript types

## 0.0.1-next.3

### Patch Changes

- Rename Rename extension function to `withBark` ([#42](https://github.com/adamjkb/bark/pull/42))

- - Fix package.json definitions ([#40](https://github.com/adamjkb/bark/pull/40))
  - Improved user-facing Typescript types

## 0.0.1-next.2

### Patch Changes

- Upgraded Prisma to v5.0.0 ([#38](https://github.com/adamjkb/bark/pull/38))

## 0.0.1-next.1

### Patch Changes

- Added README to package ([#35](https://github.com/adamjkb/bark/pull/35))
