# AI Agent Market API Stub (FastAPI)

Run locally
- python -m venv .venv && .venv\\Scripts\\activate
- pip install -r server/requirements.txt
- uvicorn server.app.main:app --reload

Docs
- Swagger UI: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/openapi.json
- Redoc (static spec): see docs/api/index.html and scripts/serve-docs.ps1

Notes
- 返回统一 `{ success, data?, error? }` 包装；当前为示例数据，待接入真实实现。
- 路由与 `docs/api/openapi.yaml` 对齐，新增或调整请先改 OpenAPI 再同步此处。

生产要点
- 限流：RateLimitMiddleware（默认 120 req/min，可用环境变量覆盖，建议接入 Redis：设置 REDIS_URL）。
- 幂等：IdempotencyMiddleware（POST + `Idempotency-Key`），建议接入 Redis 以跨进程生效。
- 安全头与 Request-Id：内置中间件已启用。
- 容器：见 server/Dockerfile 与 docker-compose.yml；可加 redis 服务并设置 REDIS_URL=redis://redis:6379/0。
