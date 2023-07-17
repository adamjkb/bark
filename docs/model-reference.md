---
description: >-
  Required fields for the extension and further explanation what each field is
  trying to achieve.
---

# Model Reference

## Database configurations

### SQLite

For some operations Bark uses Promise.all() to batch database writes but in some systems this result in locks using the SQLite database connector. Please consider setting your SQLite to only allow 1 connection at a time by adding the `connection_limit=1` query parameter to your database url.

Example:

```
url = "file:./my-database.db?connection_limit=1"
```


## Supported Prisma version

If your Prisma version below `5.0.0` consider upgrade to this version. [Prisma Release Notes.](https://github.com/prisma/prisma/releases/tag/5.0.0)


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

### `path`

type: `String` flags: `@unique`

A unique string that stores the materialized path of each node. The string is constructed of base 36 encoded, padded to minimum 4 characters. Which grants 1679615 children per node.

It is recommended to define an index in the schema for `path` since almost all methods rely on ordering by path in some ways.

Database type can optionally be mapped to a more performant [native type](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#native-types-mapping) where it's allowed, such as [`@db.VarChar(255)`](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql) in the case of PostgreSQL or MySQL.

### `depth`

type: `Int`

Integer that stores the depth of the node in the tree. Its main function is to speeds up the database queries by filtering down possible nodes to a given depth. However this comes at the cost of higher complexity when nodes are created or moved around.

_Adapted from_ [_`django-treebeard`_](/docs/acknowledgement.md)

### `numchild`

type: `Int` flags: `@default(0)`

An integer that stores the number of children of a given node. Just like [`depth`](model-reference.md#depth), its main function to speed up queries by storing this value ahead of time so we don't have to run redundant queries if we know it will yield no result. For example [`findChildren`](client-api-reference.md#find-children) will return nothing without running any database queries when the `numchild` is 0.

_Adapted from_ [_`django-treebeard`_](/docs/acknowledgement.md)
