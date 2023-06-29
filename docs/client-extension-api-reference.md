# Client Extension API reference

## Good to know

Bark doesn't override any of the existing [Prisma model queries](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries) but it is strongly recommended to create / delete new nodes using the extensions API otherwise the tree structure might not work and require a lot of manual intervention to untangle it. For similar reasons it's best not to directly update `path`, `numchild`, and `depth` properties.

## Create

### `createRoot`

| Argument  | Required                              | Description                                                                                                                                                                                        |
| --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`    | [_**Yes\***_](#foot-note-1)[^1] | Object that will be used to create new record in database.                                                                                                                                         |
| `select`  | No                                    | [Specifies which properties to include](\[/concepts/components/prisma-client/select-fields]\(https:/www.prisma.io/docs/concepts/components/prisma-client/select-fields\)/) on the returned object. |
| `include` | No                                    | [Specifies which relations should be eagerly loaded](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries) on the returned object.                                        |

### `createChild`

### `createSibling`

## Find

### `findTree`

### `findAncestors`

### `findChildren`

### `findDescendants`

### `findParent`

### `findSiblings`

### `findLastRoot`

## Delete

### `deleteNode`

### `deleteManyNodes`

## Operation

### `move`

### `fixTree` \[TBD]

## Helpers

### `isChildOf` \[TBD]

### `isSiblingOf` \[TBD]

### `isRoot` \[TBD]

[^1]: _Not required unless data model contains required fields with out a default value_
