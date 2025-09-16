# RBAC/ABAC 策略（建议）

- 基于 JWT claims：`sub` 作为主体，`roles` 为角色数组（或字符串）。
- 策略：
  - 属主优先：资源的 `userId == sub` 时允许。
  - 角色放行：`roles` 包含 `admin` 时可越权操作（示例）。
  - 细化策略可扩展为 ABAC（按资源属性与上下文）。
- 实现：`server/app/authz.py` 的 `require_owner_or_roles()` 已在关键写接口（更新资料/充值/提现）接入。
