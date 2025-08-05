---
"prisma-extension-bark": minor
---

Add support for custom Prisma client output paths

- Remove hardcoded @prisma/client imports from internal files
- Accept Prisma namespace as parameter to support custom client paths
- Maintain backward compatibility with default @prisma/client imports
- Add comprehensive tests for custom path configurations