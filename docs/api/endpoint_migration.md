# 端点迁移对照表（旧 -> 新）

- POST /api/ideas/submit -> POST /v1/ideas
- GET /api/users/[userId]/profile -> GET /v1/users/{userId}/profile
- PUT /api/users/[userId]/profile -> PUT /v1/users/{userId}/profile
- POST /api/users/[userId]/wallet/deposit -> POST /v1/users/{userId}/wallet/deposit
- POST /api/users/[userId]/wallet/withdraw -> POST /v1/users/{userId}/wallet/withdraw
- GET /api/users/[userId]/achievements -> GET /v1/users/{userId}/achievements
- GET /api/discussions/ -> GET /v1/discussions
- POST /api/discussions/ -> POST /v1/discussions
- GET /api/agents -> GET /v1/agents
- GET /api/agents/{id} -> GET /v1/agents/{agentId}
- POST /api/agents/predict-interest -> POST /v1/agents/predict-interest
- GET /api/store/products -> GET /v1/store/products
- POST /api/store/cart/add -> POST /v1/store/cart/add
- GET /api/store/cart -> GET /v1/store/cart
- PUT /api/store/cart/ -> PUT /v1/store/cart/{itemId}
- DELETE /api/store/cart/ -> DELETE /v1/store/cart/{itemId}
- POST /api/store/purchase -> POST /v1/store/purchase
- GET /api/stats/platform -> GET /v1/stats/platform
- GET /api/activities/recent -> GET /v1/activities/recent
- GET /api/testimonials -> GET /v1/testimonials

说明：后续以 `docs/api/openapi.yaml` 为单一真源，页面规范只引用，不再自行定义路径。
- GET /api/ideas/templates -> GET /v1/ideas/templates
- GET /api/discussions/{ideaId} -> GET /v1/discussions/{ideaId}
- GET /api/discussions/{ideaId}/messages -> GET /v1/discussions/{ideaId}/messages
- POST /api/discussions/{ideaId}/speak -> POST /v1/discussions/{ideaId}/messages
- GET /api/auth/social/ -> GET /v1/auth/social/providers
- GET /api/auth/social/{provider} -> GET /v1/auth/social/{provider}
- GET /api/auth/social/{provider}/callback -> GET /v1/auth/social/{provider}/callback
- GET /api/users/quota -> GET /v1/users/quota
