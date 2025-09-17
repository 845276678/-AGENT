from fastapi import FastAPI, Path, Query, Body
from typing import Any, Optional, Dict

from .config import settings
from .middleware import setup_middlewares
from .errors import http_exception_handler, validation_exception_handler, generic_exception_handler
from .logging_conf import setup_logging
from .rate_limit import RateLimitMiddleware
from .idempotency import IdempotencyMiddleware
from .observability import AccessLogMiddleware, PrometheusMiddleware, metrics_endpoint\nfrom .auth_enforce import AuthEnforceMiddleware
from .audit import audit
from .authz import require_owner_or_roles
from .metrics import (
    IDEAS_SUBMITTED, DISCUSSIONS_CREATED, MESSAGES_POSTED,
    PURCHASES_TOTAL, WALLET_DEPOSIT_TOTAL, WALLET_WITHDRAW_TOTAL
)

# Initialize app
setup_logging()
app = FastAPI(title='AI Agent Market API (Stub)', version='1.0.0', docs_url='/docs', redoc_url='/redoc')

# Middlewares
setup_middlewares(app)
# Production middlewares
app.add_middleware(AccessLogMiddleware)
app.add_middleware(PrometheusMiddleware)
app.add_middleware(AuthEnforceMiddleware)\napp.add_middleware(RateLimitMiddleware, limit_per_minute=120)\napp.add_middleware(IdempotencyMiddleware)

# Exception handlers
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Mount metrics endpoint
app.include_router(metrics_endpoint())

# --- Helpers ---
class ApiEnvelope(dict):
    def __init__(self, data: Optional[Any] = None):
        super().__init__(success=True, data=data)

# --- Auth ---
@app.post('/v1/auth/register', summary='stub')
async def auth_register(payload: Dict[str, Any] = Body(...)):
    return ApiEnvelope({"user": {"id": "u_demo", "username": payload.get('username')}, "token": "demo.jwt"})

@app.post('/v1/auth/login', summary='stub')
async def auth_login(payload: Dict[str, Any] = Body(...)):
    return ApiEnvelope({"token": "demo.jwt"})

@app.post('/v1/auth/refresh', summary='stub')
async def auth_refresh():
    return ApiEnvelope({"token": "demo.jwt"})

@app.get('/v1/auth/social/providers', summary='stub')
async def auth_social_providers():
    return ApiEnvelope({"providers": ["github", "google", "apple"]})

@app.get('/v1/auth/social/{provider}', summary='stub')
async def auth_social_provider(provider: str = Path(...)):
    return ApiEnvelope({"provider": provider, "action": "redirect"})

@app.get('/v1/auth/social/{provider}/callback', summary='stub')
async def auth_social_callback(provider: str = Path(...), code: Optional[str] = Query(None), state: Optional[str] = Query(None)):
    return ApiEnvelope({"provider": provider, "code": code, "state": state})

# --- Users & Wallet ---
@app.get('/v1/users/{userId}/profile', summary='stub')
async def users_get_profile(userId: str = Path(...)):
    return ApiEnvelope({"profile": {"username": "demo", "bio": "", "location": "", "avatarUrl": None}})

@app.put('/v1/users/{userId}/profile', summary='stub')
async def users_update_profile(userId: str = Path(...), payload: Dict[str, Any] = Body(...), request: __import__('fastapi').Request = None):\n    require_owner_or_roles(request, owner_id=userId, roles=('admin',))
    from fastapi import HTTPException
    principal = getattr(request.state, 'principal', None) if request is not None else None\n    if principal and principal != userId:
        raise HTTPException(status_code=403, detail='Forbidden')
    audit('users.updateProfile', userId=userId)
    return ApiEnvelope({})

# --- Wallet ---
@app.get('/v1/users/{userId}/wallet', summary='stub')
async def users_get_wallet(userId: str = Path(...)):
    return ApiEnvelope({"wallet": {"balance": 0, "currency": "CNY"}})

@app.post('/v1/users/{userId}/wallet/deposit', summary='stub')
async def users_wallet_deposit(userId: str = Path(...), payload: Dict[str, Any] = Body(...), request: __import__('fastapi').Request = None):
    require_owner_or_roles(request, owner_id=userId, roles=('admin',))
    WALLET_DEPOSIT_TOTAL.inc()
    audit('wallet.deposit', userId=userId, amount=payload.get('amount'))
    return ApiEnvelope({})

@app.post('/v1/users/{userId}/wallet/withdraw', summary='stub')
async def users_wallet_withdraw(userId: str = Path(...), payload: Dict[str, Any] = Body(...), request: __import__('fastapi').Request = None):
    require_owner_or_roles(request, owner_id=userId, roles=('admin',))
    WALLET_WITHDRAW_TOTAL.inc()
    audit('wallet.withdraw', userId=userId, amount=payload.get('amount'))
    return ApiEnvelope({})
async def users_wallet_withdraw(userId: str = Path(...), payload: Dict[str, Any] = Body(...), request: __import__('fastapi').Request = None):\n    require_owner_or_roles(request, owner_id=userId, roles=('admin',))
    audit('wallet.withdraw', userId=userId, amount=payload.get('amount'))
    WALLET_WITHDRAW_TOTAL.inc()
    return ApiEnvelope({})

@app.get('/v1/users/{userId}/achievements', summary='stub')
async def users_get_achievements(userId: str = Path(...)):
    return ApiEnvelope({"achievements": []})

@app.get('/v1/users/quota', summary='stub')
async def users_get_quota():
    return ApiEnvelope({"remaining": 0})

# --- Ideas ---
@app.get('/v1/ideas', summary='stub')
async def ideas_list(page: int = Query(1, ge=1), pageSize: int = Query(20, ge=1, le=200)):
    return ApiEnvelope({"items": [], "page": page, "pageSize": pageSize})

@app.post('/v1/ideas', summary='stub')
async def ideas_create(payload: Dict[str, Any] = Body(...)):
    IDEAS_SUBMITTED.inc()
    audit('ideas.create')
    return ApiEnvelope({"idea": {"id": "i_demo", "content": payload.get('content')}})

@app.get('/v1/ideas/{ideaId}', summary='stub')
async def ideas_get(ideaId: str = Path(...)):
    return ApiEnvelope({"idea": {"id": ideaId}})

@app.put('/v1/ideas/{ideaId}', summary='stub')
async def ideas_update(ideaId: str = Path(...), payload: Dict[str, Any] = Body(...)):
    audit('ideas.update', ideaId=ideaId)
    return ApiEnvelope({})

@app.get('/v1/ideas/templates', summary='stub')
async def ideas_templates(category: Optional[str] = Query(None), difficulty: Optional[str] = Query(None)):
    return ApiEnvelope({"templates": []})

# --- Discussions ---
@app.get('/v1/discussions', summary='stub')
async def discussions_list(ideaId: Optional[str] = Query(None)):
    return ApiEnvelope({"items": []})

@app.post('/v1/discussions', summary='stub')
async def discussions_create(payload: Dict[str, Any] = Body(...)):
    DISCUSSIONS_CREATED.inc()
    audit('discussions.create', ideaId=payload.get('ideaId'))
    return ApiEnvelope({"id": "d_demo"})

@app.get('/v1/discussions/{ideaId}', summary='stub')
async def discussions_get(ideaId: str = Path(...)):
    return ApiEnvelope({"id": ideaId, "messages": []})

@app.get('/v1/discussions/{ideaId}/messages', summary='stub')
async def discussions_list_messages(ideaId: str = Path(...), offset: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100)):
    return ApiEnvelope({"items": [], "offset": offset, "limit": limit})

@app.post('/v1/discussions/{ideaId}/messages', summary='stub')
async def discussions_post_message(ideaId: str = Path(...), payload: Dict[str, Any] = Body(...)):
    MESSAGES_POSTED.inc()
    audit('discussions.message', ideaId=ideaId)
    return ApiEnvelope({})

# --- Agents ---
@app.get('/v1/agents', summary='stub')
async def agents_list():
    return ApiEnvelope({"items": []})

@app.get('/v1/agents/{agentId}', summary='stub')
async def agents_get(agentId: str = Path(...)):
    return ApiEnvelope({"id": agentId})

@app.post('/v1/agents/predict-interest', summary='stub')
async def agents_predict_interest(payload: Dict[str, Any] = Body(...)):
    return ApiEnvelope({"predictions": []})

# --- Store ---
@app.get('/v1/store/products', summary='stub')
async def store_products(page: int = Query(1, ge=1), pageSize: int = Query(20, ge=1, le=200)):
    return ApiEnvelope({"items": [], "page": page, "pageSize": pageSize})

@app.get('/v1/store/cart', summary='stub')
async def store_cart_get():
    return ApiEnvelope({"items": [], "total": 0, "currency": "CNY"})

@app.post('/v1/store/cart/add', summary='stub')
async def store_cart_add(payload: Dict[str, Any] = Body(...)):
    audit('cart.add')
    return ApiEnvelope({})

@app.put('/v1/store/cart/{itemId}', summary='stub')
async def store_cart_update(itemId: str = Path(...), payload: Dict[str, Any] = Body(...)):
    audit('cart.update', itemId=itemId)
    return ApiEnvelope({})

@app.delete('/v1/store/cart/{itemId}', summary='stub')
async def store_cart_delete(itemId: str = Path(...)):
    audit('cart.remove', itemId=itemId)
    return ApiEnvelope({})

@app.post('/v1/store/purchase', summary='stub')
async def store_purchase():
    audit('store.purchase')
    PURCHASES_TOTAL.inc()
    return ApiEnvelope({})

# Health & readiness
@app.get('/healthz')
async def healthz():
    return {"ok": True}

@app.get('/readyz')
async def readyz():
    return {"ready": True}








