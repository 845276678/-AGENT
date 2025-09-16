# SDK 生成与契约校验（示例）

生成 TypeScript 类型与 SDK 示例
- cd sdk
- npm install
- npm run gen  # 基于 ../docs/api/openapi.yaml 生成 src/types.ts
- 查看 src/client.ts 与 src/example.ts 的用法（基于 openapi-fetch）

可选：本地联调
- 启动 FastAPI stub：`uvicorn server.app.main:app --reload`
- 运行示例：`npm run gen && npx ts-node src/example.ts`

契约测试（建议）
- 使用 Schemathesis 针对 openapi.yaml 做基本探测：
  schemathesis run --checks all --base-url=http://localhost:8000 ../docs/api/openapi.yaml
- 或使用 Dredd / Prism 进行契约校验与模拟。

注意
- 单一真源：../docs/api/openapi.yaml；变更优先更新此文件。
