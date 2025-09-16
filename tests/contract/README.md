# 契约测试（草案）

推荐工具
- Schemathesis（Python）：基于 OpenAPI 的基于属性的测试
- Prism（Node）：OpenAPI 模拟/校验
- Dredd（Node）：API 契约测试

本地运行示例（Schemathesis）
- pip install schemathesis
- uvicorn server.app.main:app --reload
- schemathesis run --checks all --base-url=http://localhost:8000 ../docs/api/openapi.yaml

提示
- 如果仅做静态校验，可用 `npx @redocly/cli lint` 或 `npx swagger-cli validate`。
