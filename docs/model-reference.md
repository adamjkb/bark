---
description: >-
  Required fields for the extension and further explanation what each field is
  trying to achieve.
---

# Model Reference

## Minimum required model

```prisma
model node {
    id       Int    @id @default(autoincrement())
    path     String @unique
    depth    Int
    numchild Int    @default(0)

    @@index([path])
}
```

If you are using a `prisma` version older than `4.16.0` make sure you add `clientExtensions` flag to your client [`previewFeatures`](https://www.prisma.io/docs/concepts/components/preview-features/client-preview-features#enabling-a-prisma-client-preview-feature).

#### `path`

type: `String` flags: `@unique`

A unique string that stores the materialized path of each node. The string is constructed of base 36 encoded, padded to minimum 4 characters. Which grants 1679615 children per node.

It is recommended to define an index in the schema for `path` since almost all methods rely on ordering by path in some ways.

Database type can optionally be mapped to a more performant [native type](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#native-types-mapping) where it's allowed, such as [`@db.VarChar(255)`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql) in the case of PostgreSQL or MySQL.

#### `depth`

type: `Int`

Integer that stores the depth of the node in the tree. Its main function is to speeds up the database queries by filtering down possible nodes to a given depth. However this comes at the cost of higher complexity when nodes are created or moved around.

_Adapted from_ [_`django-treebeard`_](https://django-treebeard.readthedocs.io)

#### `numchild`

type: `Int` flags: `@default(0)`

An integer that stores the number of children of a given node. Just like [`depth`](model-reference.md#depth), its main function to speed up queries by storing this value ahead of time so we don't have to run redundant queries if we know it will yield no result. For example [`findChildren`](client-api-reference.md#find-children) will return nothing without running any database queries when the `numchild` is 0.

_Adapted from_ [_`django-treebeard`_](https://django-treebeard.readthedocs.io)
