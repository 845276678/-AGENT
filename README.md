[![web-ci](https://github.com/845276678/-AGENT/actions/workflows/web-ci.yml/badge.svg?branch=main)](https://github.com/845276678/-AGENT/actions/workflows/web-ci.yml)

# 项目概览

本仓库包含 AI Agent 市场的产品、页面与技术文档。现已建立「单一真源」的 API 规范与工程文档骨架，支撑后续实现与协作。

- 单一真源：`docs/api/openapi.yaml`（OpenAPI 3.1）
- API 风格：`docs/api/style-guide.md`
- 端点迁移：`docs/api/endpoint_migration.md`
- 架构与部署：`docs/architecture/系统与部署.md`
- 运维与可观测：`docs/ops/可观测性与运行手册.md`
- 安全与合规：`docs/security/威胁建模.md`、`docs/policy/隐私政策.md`、`docs/policy/服务条款.md`
- 数据与迁移：`docs/data/模型与迁移.md`
- 质量与验收：`docs/quality/测试计划与验收标准.md`

目录结构（节选）

- docs/
  - api/
    - openapi.yaml
    - style-guide.md
    - endpoint_migration.md
  - architecture/系统与部署.md
  - ops/可观测性与运行手册.md
  - security/威胁建模.md
  - policy/隐私政策.md, 服务条款.md
  - data/模型与迁移.md
  - quality/测试计划与验收标准.md

更新约定
- 任何接口变更以 `openapi.yaml` 为准；页面文档引用而非复制。
- 重要设计变更需同时更新架构、数据与测试文档。

预览 API 文档
- 方式一：在仓库根目录执行 `powershell -ExecutionPolicy Bypass -File scripts/serve-docs.ps1`，浏览器打开 http://localhost:8080/docs/api/
- 方式二：使用任意静态服务器（如 `npx http-server .`），然后访问 /docs/api/

本地运行服务端桩
- python -m venv .venv && .venv\Scripts\activate
- pip install -r server/requirements.txt
- uvicorn server.app.main:app --reload

生成 TypeScript SDK（示例）
- cd sdk && npm install
- npm run gen  # 基于 docs/api/openapi.yaml 生成 src/types.ts
- 运行示例：npx ts-node src/example.ts

CI 与测试
- 本地运行：`pytest -q`
- CI：已在 .github/workflows/ci.yml 配置（含 Redis 服务、OpenAPI lint、SDK 类型生成）
- Redis：可选设置 REDIS_URL=redis://localhost:6379/0 开启分布式限流与幂等。

文档导航
- 详见 `docs/README.md` 与 `docs/checklist_content_completeness.md`
