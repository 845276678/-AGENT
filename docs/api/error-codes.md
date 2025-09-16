# 错误码规范（草案）

命名规则
- 分类.语义.细分，全部大写+点分隔，例如：
  - AUTH.INVALID_CREDENTIALS
  - AUTH.UNAUTHORIZED
  - AUTH.FORBIDDEN
  - RATE.LIMIT
  - VALIDATION.ERROR
  - STORE.OUT_OF_STOCK
  - WALLET.INSUFFICIENT_FUNDS

对照建议
- 401：AUTH.UNAUTHORIZED
- 403：AUTH.FORBIDDEN
- 404：HTTP.404
- 409：RESOURCE.CONFLICT
- 422：VALIDATION.ERROR
- 429：RATE.LIMIT
- 5xx：INTERNAL.ERROR

返回格式
- { success:false, error:{ code, message, details? } }

约定
- code 必须符合正则 `^[A-Z]+(\.[A-Z_]+)*$`；message 为人类可读简述；details 可为附加结构化上下文。
