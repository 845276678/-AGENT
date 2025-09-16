import json
import time
import logging
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

logger = logging.getLogger('access')

REQUEST_COUNTER = Counter(
    'http_requests_total', 'HTTP 请求总数', ['method','path','status']
)
REQUEST_DURATION = Histogram(
    'http_request_duration_seconds', 'HTTP 请求耗时', ['method','path']
)

class AccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        start = time.perf_counter()
        response: Response
        try:
            response = await call_next(request)
        finally:
            duration = (time.perf_counter() - start)
            try:
                path = request.scope.get('route').path  # type: ignore[attr-defined]
            except Exception:
                path = request.url.path
            record = {
                'ts': time.time(),
                'method': request.method,
                'path': path,
                'status': (locals().get('response').status_code if 'response' in locals() else 500),
                'duration_ms': round(duration * 1000, 1),
                'request_id': request.headers.get('X-Request-Id')
            }
            logger.info(json.dumps(record, ensure_ascii=False))
        return response

class PrometheusMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        start = time.perf_counter()
        response: Response = await call_next(request)
        try:
            path = request.scope.get('route').path  # type: ignore[attr-defined]
        except Exception:
            path = request.url.path
        REQUEST_COUNTER.labels(request.method, path, str(response.status_code)).inc()
        REQUEST_DURATION.labels(request.method, path).observe(time.perf_counter() - start)
        return response


def metrics_endpoint():
    from fastapi import APIRouter, Response
    router = APIRouter()

    @router.get('/metrics')
    async def metrics():
        return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

    return router
