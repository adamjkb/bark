---
"prisma-extension-bark": minor
---

Add support for custom Prisma client paths

Users can now specify a custom Prisma client path when initializing Bark, which is useful when the Prisma client is generated to a custom location:

```js
const xprisma = new PrismaClient().$extends(
  await withBark({ 
    modelNames: ['node'],
    prismaClientPath: '../generated/prisma-client/extension'
  })()
)
```