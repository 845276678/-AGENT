# Kubernetes 部署说明（示例）

- 使用 docs/architecture/k8s/api-deployment.yaml 作为基础，根据你的镜像仓库与环境变量调整。
- 建议：通过 Ingress/网关暴露，启用 HTTPS 与 TLS 终止；在 Ingress 层透传 `X-Request-Id`。
- 观测：配置 Prometheus 抓取 /metrics；Grafana 仪表盘展示请求量/错误率/耗时直方图。
