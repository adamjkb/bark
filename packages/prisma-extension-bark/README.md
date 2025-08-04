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

#### Installing from GitHub

To install directly from GitHub before the changes are published to npm:

**For pnpm users:**
```bash
# Install from the monorepo subdirectory
pnpm add "github:lpan/bark#path:packages/prisma-extension-bark&lpan/custom-prisma-path-take-2"

# Or use pnpm link for local development
git clone -b lpan/custom-prisma-path-take-2 https://github.com/lpan/bark.git
cd bark/packages/prisma-extension-bark
pnpm install
pnpm link --global

# Then in your project:
pnpm link --global prisma-extension-bark
```

**For npm/yarn users (use local linking):**
```bash
# Clone and link locally
git clone -b lpan/custom-prisma-path-take-2 https://github.com/lpan/bark.git
cd bark/packages/prisma-extension-bark
npm install
npm link

# Then in your project:
npm link prisma-extension-bark
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
import { PrismaClient, Prisma } from '@prisma/client'
import { withBark } from 'prisma-extension-bark'

const xprisma = new PrismaClient().$extends(
  withBark({ modelNames: ['node'] })(Prisma)
)

const myNewRootNode = await xprisma.node.createRoot({ data: { name: 'My new root' } })
// { id: 1, path: '0001', depth: 1, numchild: 0, name: 'My new root' }
```

### Using Custom Prisma Output Paths

If you're using Prisma with a custom output path (common in monorepo setups), you need to pass the Prisma namespace from your generated client:

```js
// With custom output path
import { PrismaClient, Prisma } from '../generated/client'
import { withBark } from 'prisma-extension-bark'

const xprisma = new PrismaClient().$extends(
  withBark({ modelNames: ['node'] })(Prisma)
)
```
