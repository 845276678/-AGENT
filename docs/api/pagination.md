# 分页约定（Pagination）

- 查询参数：`page`（从1开始）、`pageSize`（默认20，最大200）。
- 返回结构：`data.items: []`、`data.page`、`data.pageSize`；必要时补充 `total`、`hasMore`。
- 排序：默认按创建时间倒序；可用 `sortBy` 与 `order` 指定，值域在各端点说明。
