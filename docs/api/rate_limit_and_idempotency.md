# 限流与幂等（细则）

- 限流：默认 120 rpm，写操作更严格（wallet/purchase 30 rpm、discussions/ideas 60 rpm）；触发返回 429 + `Retry-After`。
- 幂等：POST + `Idempotency-Key`；同 key 在 TTL 内返回相同成功结果。
- 监控：暴露 `X-RateLimit-*`；Prometheus 监控 429 比例与窗口利用率。
