---
description: >-
  Bark is an implementation of the Materialized Path pattern that allows you to
  easily create and interact with tree structures in Prisma.
---

# Introduction

## What is Materialized Path?

Materialized path pattern is a way to represent hierarchical data in a database using a path-like structure stored. It involves storing the path from the root to each node in a string rather in relations, which allows for more efficient querying and traversing of the tree. Performance benefits aside, it is also considerably easier to interact with a tree structure using this pattern.

## What are the use cases?

This pattern is useful anytime you need to represent relational structures in a database. One of the simplest examples of such structure is a filesystem. But think of comment threads, decision trees, product categories.

```
.
├── users/
│   ├── alison/
│   │   ├── photos/
│   │   │   ├── img-01.jpg
│   │   │   └── img-02.jpg
│   │   └── website/
│   │       └── index.html
│   └── bob/
│       └── documents/
│           └── resume-2023.pdf
├── sys/
│   ├── kernel
│   └── dev
└── etc
```

While using self-relations to create a similar structure in a relational database is certainly possible it is not efficient or ergonomic. But we can store these paths and relations in a simple string instead.

For example, we can say that the root is `01`, and its subfolders (children) are `users`, `sys`, and `etc` will have a path of `0101`, `0102` and `0103` respectively. Following this pattern the file `img-02.jpg` will have a path of `0101010102`. Of course it could've been written as `/users/alison/photos/img-02.jpg`, like say in a file system, but it's quite obvious how inefficient it is to use human language to encode something that really, only computers should care about.

To put these paths to good use, let's get all the files that belongs to Alison. This is actually quite simple, all we have get all the nodes in the tree that starts with `010101`, and that's it! No relations, no subqueries, nothing!

## Bark's implementation of Materialized Path

The actual implementation of the pattern is actually a little bit more nuanced than in the example above. We are using 4-digit steps to describe the [`path`](model-reference.md#path) instead of 2 and use two additional fields to further optimize queries, [`depth`](model-reference.md#depth) and [`numchild`](model-reference.md#numchild). If that sounds familiar that because Bark has been inspired by [`django-treebeard`](acknowledgement.md). This extension aims to bring the very capable API to Prisma.
