# 日志采集与留存（建议）

输出格式
- `LOG_FORMAT=json` 时输出 JSON 结构日志，便于采集；默认 `text`。
- 可选文件落盘：设置 `LOG_FILE_PATH=/var/log/api/app.log`（自动滚动，默认 10MB*5）。

采集方案示例
- Vector：监听文件/Stdout，转发到 Elasticsearch/OpenSearch；附加字段（env、service）与采样策略。
- ELK：Filebeat/Logstash 收集与索引；Kibana 建看板（错误率、响应时间、限流命中）。

留存与脱敏
- 访问日志与审计日志采用不同索引/Topic；审计日志已对常见敏感字段脱敏（password/token/email/phone/card）。
- 推荐留存策略：访问日志 7–14 天、审计日志 30–90 天（按合规与成本权衡）。
