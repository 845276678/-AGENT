import time
import uuid
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware import Middleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi import FastAPI
from .config import settings

class RequestIDMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, header_name: str = 'X-Request-Id'):
        super().__init__(app)
        self.header_name = header_name

    async def dispatch(self, request: Request, call_next: Callable):
        req_id = request.headers.get(self.header_name) or str(uuid.uuid4())
        start = time.perf_counter()
        response: Response = await call_next(request)
        duration = (time.perf_counter() - start) * 1000.0
        response.headers[self.header_name] = req_id
        response.headers['X-Process-Time'] = f"{duration:.1f}ms"
        return response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        response: Response = await call_next(request)
        response.headers.setdefault('X-Content-Type-Options', 'nosniff')
        response.headers.setdefault('X-Frame-Options', 'DENY')
        response.headers.setdefault('Referrer-Policy', 'no-referrer')
        # Minimal CSP; adjust per static assets and pages
        response.headers.setdefault('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none';")
        return response


def setup_middlewares(app: FastAPI) -> None:
    if settings.FORCE_HTTPS:
        app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins(),
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
        expose_headers=[settings.REQUEST_ID_HEADER, 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'Retry-After'],
    )
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.trusted_hosts())
    app.add_middleware(RequestIDMiddleware, header_name=settings.REQUEST_ID_HEADER)
    app.add_middleware(SecurityHeadersMiddleware)
