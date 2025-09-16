from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from starlette.exceptions import HTTPException as StarletteHTTPException\nfrom .auth_utils import get_principal_from_request\nfrom .jwt_verify import verify_jwt

PUBLIC_PREFIXES = (
    '/v1/auth/',
    '/v1/stats/platform',
    '/v1/activities/recent',
    '/v1/testimonials',
    '/docs', '/redoc', '/openapi.json', '/metrics', '/healthz', '/readyz'
)

class AuthEnforceMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable):
        path = request.url.path
        if not path.startswith('/v1') or any(path.startswith(p) for p in PUBLIC_PREFIXES):
            return await call_next(request)
        auth = request.headers.get('Authorization') or ''
        if not auth.startswith('Bearer '):\n            raise StarletteHTTPException(status_code=401, detail='Unauthorized')\n        # Attach principal for downstream authorization checks\n        claims = verify_jwt(auth.split(' ',1)[1])\n        principal = (claims or {}).get('sub') if claims is not None else get_principal_from_request(request)
        try:\n            request.state.principal = principal
            request.state.claims = claims or {}
        except Exception:\n            pass
        return await call_next(request)




