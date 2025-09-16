# API 端点风格与命名规范（草案）

- 版本：统一前缀 `/v1`，仅对破坏性变更提升大版本。
- 路径：资源名用复数；路径参数花括号 `{id}`；动词放到语义动作子资源，如 `/agents/predict-interest`。
- 鉴权：HTTP `Authorization: Bearer <JWT>`；除公开查询外默认必需。
- 响应包：`{ success, data?, error? }`；附带 `X-Request-Id`、限流头。
- 错误：`4xx/5xx` + 业务 `error.code`；幂等操作支持 `Idempotency-Key`。
- 分页：`page` `pageSize`；列表默认降序按时间。
- 过滤：查询参数驼峰；多值用逗号或重复键，保持一贯。
- 时间：ISO8601（UTC） `date-time`；金额统一最小货币单位或小数，文档声明。
- 速率限制：`X-RateLimit-*` 与 `Retry-After`；认证、写操作更严格。
- WebSocket：路径 `/v1/discussions/{ideaId}`，Query `token=JWT`；事件以 `type` 区分。
- 请求追踪：所有响应包含 `X-Request-Id`，服务端支持透传同名请求头。
- 安全响应头：默认设置 `X-Content-Type-Options=nosniff`、`X-Frame-Options=DENY`、`Referrer-Policy=no-referrer`、`CSP`（按需收紧）。
- 幂等：对有副作用的 POST（如 `/store/purchase`, `/users/{userId}/wallet/*`, `/discussions/{ideaId}/messages`, `/ideas`），支持 `Idempotency-Key`。
- 限流：响应附带 `X-RateLimit-Limit`、`X-RateLimit-Remaining`、必要时使用 `Retry-After`。
- 认证与公开端点：默认需要 Bearer；面向公开展示的只读端点（`/auth/*`, `/stats/platform`, `/activities/recent`, `/testimonials`）使用 `security: []`，返回中不必列 401。
- 授权：需要权限的写操作可返回 403（如资源属主/角色受限）。
- 错误响应：为所有端点补充 `401/403/429/default`（公开端点除外）；标准化返回 `ErrorEnvelope`。
