# 数据字典（初稿）

- users：id, username, email, password_hash, created_at
- ideas：id, user_id, content, status, created_at
- agents：id, name, description, daily_budget
- store.products：id, name, price, currency, description
- 备注：字段命名统一 snake_case；跨服务使用同一语义与单位。
