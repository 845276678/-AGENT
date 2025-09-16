import json
import time
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from .storage import storage
from .errors import api_error

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit_per_minute: int = 120):
        super().__init__(app)
        self.limit = limit_per_minute\n        self.buckets = [\n            (('POST', '/v1/users/') , 30),\n            (('POST', '/v1/store/purchase'), 30),\n            (('POST', '/v1/discussions'), 60),\n            (('POST', '/v1/ideas'), 60)\n        ]

    async def dispatch(self, request: Request, call_next: Callable):
        path = request.url.path
        if not path.startswith('/v1'):
            return await call_next(request)
        # Simple key: prefer auth token subject, else client IP
                auth = request.headers.get("Authorization", "")
        principal = None
        if auth.startswith("Bearer "):
            token = auth.split(" ",1)[1]
            try:
                # Parse JWT payload without verification
                parts = token.split('.')
                if len(parts) >= 2:
                    import base64, json as _json
                    pad = '=' * (-len(parts[1]) % 4)
                    payload = _json.loads(base64.urlsafe_b64decode(parts[1] + pad))
                    principal = payload.get('sub')
            except Exception:
                principal = None
        client_id = principal or (request.client.host if request.client else 'unknown')
        minute = int(time.time() // 60)
        key = f"rl:{client_id}:{minute}"
        count = await storage.incr(key, ttl=60)
        limit = self.limit\n        for (m,p),lim in self.buckets:\n            if request.method == m and path.startswith(p):\n                limit = lim; break\n        remaining = max(0, limit - count)
        if count > self.limit:
            resp = api_error('RATE.LIMIT', '请求过于频繁，请稍后再试', status_code=429)
            resp.headers['X-RateLimit-Limit'] = str(limit)
            resp.headers['X-RateLimit-Remaining'] = '0'
            resp.headers['Retry-After'] = '60'
            return resp
        response: Response = await call_next(request)
        response.headers['X-RateLimit-Limit'] = str(limit)
        response.headers['X-RateLimit-Remaining'] = str(remaining)
        return response


