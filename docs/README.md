# Bark

A materialized path extension for Prisma — `prisma-extension-bark`

## API completion list

- [ ]  add_root
- [x]  add_child -> createChild
- [x]  add_sibling -> createSibling

- [x] delete -> deleteNode & deleteManyNodes

- [ ]  get_tree
- [ ]  get_depth
- [x]  get_ancestors -> findAncestors
- [ ]  get_children - findChildren
- [ ]  get_children_count
- [x]  get_descendants -> findDescendants
- [ ]  get_descendant_count
- [ ]  get_first_child
- [ ]  get_last_child
- [ ]  get_first_sibling
- [ ]  get_last_sibling
- [ ]  get_prev_sibling
- [ ]  get_next_sibling
- [x]  get_parent -> findParent
- [ ]  get_root
- [x]  get_siblings -> findSiblings
- [ ]  is_child_of
- [ ]  is_descendant_of
- [ ]  is_sibling_of
- [ ]  is_root
- [ ]  is_leaf

- [x]  move

- [ ]  get_first_root_node
- [ ]  get_last_root_node
- [ ]  get_root_nodes

- [ ]  find_problems
- [ ]  fix_tree
- [ ]  get_descendants_group_count
