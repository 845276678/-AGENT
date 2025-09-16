import json
import hashlib
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from .storage import storage

class IdempotencyMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, header_name: str = 'Idempotency-Key', ttl_seconds: int = 3600):
        super().__init__(app)
        self.header_name = header_name
        self.ttl = ttl_seconds

    async def dispatch(self, request: Request, call_next: Callable):
        if request.method != 'POST' or not request.url.path.startswith('/v1'):
            return await call_next(request)
        key = request.headers.get(self.header_name)
        if not key:
            return await call_next(request)
        # Include path in key; optionally include auth principal
        scope_key = f"idem:{request.url.path}:{key}"
        cached = await storage.get(scope_key)
        if cached:
            # Return cached JSON response
            payload = json.loads(cached)
            return Response(content=json.dumps(payload), media_type='application/json', status_code=200)
        # Call downstream and capture response body
        response: Response = await call_next(request)
        # Only cache JSON 2xx responses
        if 200 <= response.status_code < 300 and response.media_type == 'application/json':
            body = b''
            async for chunk in response.body_iterator:
                body += chunk
            # Rebuild response because body_iterator is consumed
            new_resp = Response(content=body, status_code=response.status_code, media_type=response.media_type)
            for k, v in response.headers.items():
                new_resp.headers[k] = v
            try:
                await storage.set(scope_key, body.decode('utf-8'), ttl=self.ttl)
            except Exception:
                pass
            return new_resp
        return response
