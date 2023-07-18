# Playground

You may use this directory to have a play around with Bark.

## Initialize with pnpm

This directory relies on pnpm's workspace aliasing so please initialize the repo using pnpm. [Install pnpm](https://pnpm.io/installation). To use npm, you may temporarily change the `prisma-extension-bark` dependency's version to use our latest version published on npm instead of `workspace:^` defined in the `package.json` of this directory.

```bash
pnpm i
```

## Generate Prisma Client

There is already an SQLite database, pre-seeded in place so all you have to do is generate the Prisma Client if you haven't already.


```bash
pnpx prisma generate
```

After that you may run `pnpm start` to start a watch task on the `index.js` file.
