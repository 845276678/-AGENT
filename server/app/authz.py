from typing import Iterable, Optional
from fastapi import HTTPException, Request


def require_owner_or_roles(request: Request, owner_id: Optional[str], roles: Iterable[str] = ()):  # raises on forbidden
    principal = getattr(request.state, 'principal', None)
    claims = getattr(request.state, 'claims', {}) or {}
    role_set = set(claims.get('roles') or []) if isinstance(claims.get('roles'), (list, tuple)) else set([claims.get('roles')]) if claims.get('roles') else set()
    if owner_id and principal == owner_id:
        return
    if roles and (role_set & set(roles)):
        return
    raise HTTPException(status_code=403, detail='Forbidden')
