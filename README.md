# Bark

`prisma-extension-bark` is an implementation of the Materialized Path pattern that allows you to easily create and interact with tree structures in Prisma.


See the [documentation](https://prisma-extension-bark.gitbook.io/) to learn more.

## Quick start

For more context please refer to our [Getting Started guide](https://prisma-extension-bark.gitbook.io/docs/getting-started).

### 1. Install dependencies

```bash
npm i @prisma/client prisma-extension-bark 
npm i -D prisma
npx prisma init
```

### 2. Implement the required field on your model
```prisma
// prisma/schema.prisma
model node {
    // Extension's internal fields
    id       Int    @id @default(autoincrement())
    path     String @unique
    depth    Int
    numchild Int    @default(0)
    
	// Your fields go here...
    name     String

    @@index([path])
}
```

### 3. Create migrations

```bash
npx prisma migrate dev
```

## 4. Extend Prisma Client with Bark
```js
// index.js
import { PrismaClient } from '@prisma/client'
import { bark } from 'prisma-extension-bark'

const xprisma = new PrismaClient().$extends(bark({ modelNames: ['node'] }))

const myNewRootNode = await xprisma.node.createRoot({ data: { name: 'My new root' } })
// { id: 1, path: '0001', depth: 1, numchild: 0, name: 'My new root' }
```
