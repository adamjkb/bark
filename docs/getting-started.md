# Getting started

If you would like just have a quick peak at a working project how a look at our [`playground` folder on GitHub](https://github.com/adamjkb/bark/tree/main/playground).

## 1. Setup Prisma project

Install the following node modules dependencies. [See Prisma quick start guide.](https://www.prisma.io/docs/getting-started/quickstart) If you already have a Prisma project you can go ahead and simply install `prisma-extension-bark` only and skip to the next step.

```bash
npm i @prisma/client prisma-extension-bark 
npm i -D prisma
```

Run Prisma initialization command. (This will create new a folder named `prisma` with a `prisma.schema` file.)

```bash
npx prisma init
```

## 2. Implement the required field on your model

In your `schema.prisma` file create a `node` model with the minimum required fields for Bark to work and the field you would like to have on this model. For more information on the model refer to [Model Reference](model-reference.md) documentation.

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

## 3. Create migration

Run the following command to create a new database migration. For more information on this Prisma CLI command [see Prisma documentation](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev).

```bash
npx prisma migrate dev
```

## 4. Extend Prisma Client with Bark

Nearly there! Create a new .js/.ts file and extend your Prisma client.  [Learn about Prisma Client extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions#about-prisma-client-extensions).

```js
// index.js
import { PrismaClient } from '@prisma/client'
import { bark } from 'prisma-extension-bark'

const xprisma = new PrismaClient().$extends(bark({ modelNames: ['node'] }))

const myNewRootNode = await xprisma.node.createRoot({ data: { name: 'My new root' } })
// { id: 1, path: '0001', depth: 1, numchild: 0, name: 'My new root' }
```

Have a look at our [Client Extension API documentation](/docs/client-extension-api-reference.md) to discover what else you can do with Bark. 
