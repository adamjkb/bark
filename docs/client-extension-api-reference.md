# Client Extension API reference

## Good to know

Bark doesn't override any of the existing [Prisma model queries](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries) but it is strongly recommended to create / delete new nodes using the extensions API otherwise the tree structure might not work and require a lot of manual intervention to untangle it. For similar reasons it's best not to directly update `path`, `numchild`, and `depth` properties.

## Create

### `createRoot`

Creates a root node if one doesn't exist already or adds a sibling to an already existing one. Returns the newly create node entry.

| Argument  | Required                        | Description                                                                                                                                                                                        |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`    | [_**Yes\***_](#foot-note-1)[^1] | Object that will be used to create new record in database.                                                                                                                                         |
| `select`  | No                              | [Specifies which properties to include](\[/concepts/components/prisma-client/select-fields]\(https:/www.prisma.io/docs/concepts/components/prisma-client/select-fields\)/) on the returned object. |
| `include` | No                              | [Specifies which relations should be eagerly loaded](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries) on the returned object.                                        |

<details>

<summary>Example</summary>

```js
const myNewRootNode = await xprisma.node.createRoot({ data: { name: 'My new root' } })
// { id: 1, path: '0001', depth: 1, numchild: 0, name: 'My new root' }
```

</details>

### `createChild`

Creates a new child to the defined node in either `where` or `node` arguments. Returns the newly create node entry.

| Argument  | Required                        | Description                                                                                                                                                                                        |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | Yes unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                                                                                                                                    |
| `where`    | Yes unless `node` | Query to find an existing node to be used as a reference.                                                                                                                                                          |
| `data`    | [_**Yes\***_](#foot-note-1)[^1] | Object that will be used to create new record in database.                                                                                                                                         |
| `select`  | No                              | [Specifies which properties to include](\[/concepts/components/prisma-client/select-fields]\(https:/www.prisma.io/docs/concepts/components/prisma-client/select-fields\)/) on the returned object. |
| `include` | No                              | [Specifies which relations should be eagerly loaded](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries) on the returned object.                                        |


<details>

<summary>Example</summary>

```js
const futureParentNode = await xprisma.node.findUnique({ where: { id: 1 }})
const newChildNode = await xprisma.node.createChild({
	node: futureParentNode,
	data: { name: 'New born' }, 
	select: { name: true } 
})
// { name: 'New born' }
```

</details>


### `createSibling`

Creates a new sibling to the defined node in either `where` or `node` arguments. The node will be created at after last sibling of the level. Returns the newly create node entry.

| Argument  | Required                        | Description                                                                                                                                                                                        |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node`    | Yes unless `where` | An existing node used as a reference where the incoming entry should be created.                                                                                                                                                                                    |
| `where`    | Yes unless `node` | Query to find an exisiting node to be used as a reference.                                                                                                                                                          |
| `data`    | [_**Yes\***_](#foot-note-1)[^1] | Object that will be used to create new record in database.                                                                                                                                         |
| `select`  | No                              | [Specifies which properties to include](\[/concepts/components/prisma-client/select-fields]\(https:/www.prisma.io/docs/concepts/components/prisma-client/select-fields\)/) on the returned object. |
| `include` | No                              | [Specifies which relations should be eagerly loaded](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries) on the returned object.                                        |

<details>

<summary>Example</summary>

```js
const siblingNode = await xprisma.node.findUnique({ where: { id: 1 }})
const newChildNode = await xprisma.node.createSibling({
	node: siblingNode,
	data: { name: 'New sibling' }, 
	select: { name: true } 
})
// { name: 'New sibling' }
```

</details>

## Find

### `findTree`

### `findAncestors`

### `findDescendants`

### `findParent`

### `findChildren`

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
