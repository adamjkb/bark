# Getting started

## 1. Install extension package

```bash
npm i prisma-extension-bark
```

## 2. Implement the required field on your model

Create a `node` model with the minimum required field and the field you would like to have on this model. For more information on this model refer to [Model Reference](model-reference.md) documentation.

```prisma
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

## 3. Create migration

For more information on this Prisma CLI command [see Prisma documentation](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev).

```bash
npx prisma migrate dev
```

## 4. Extend Prisma Client with Bark

[Learn about Prisma Client extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions#about-prisma-client-extensions).

```js
import { PrismaClient } from '@prisma/client'
import { bark } from 'prisma-extension-bark'

const xprisma = new PrismaClient().$extends(bark)
```
