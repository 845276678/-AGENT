import time
from typing import Optional, Tuple
from jose import jwt, jwk
from jose.utils import base64url_decode
import requests

from .config import settings

_jwks_cache: Tuple[float, dict] | None = None


def _load_jwks() -> Optional[dict]:
    global _jwks_cache
    if not settings.JWT_JWKS_URL:
        return None
    now = time.time()
    if _jwks_cache and now - _jwks_cache[0] < 300:
        return _jwks_cache[1]
    resp = requests.get(settings.JWT_JWKS_URL, timeout=5)
    resp.raise_for_status()
    data = resp.json()
    _jwks_cache = (now, data)
    return data


def verify_jwt(token: str) -> Optional[dict]:
    """Return claims dict if valid, else None. Supports JWKS, static public key, or shared secret.
    If no verifier configured, returns unverified claims for dev use.
    """
    try:
        algos = [a.strip() for a in (settings.JWT_ALGORITHMS or '').split(',') if a.strip()]
        if settings.JWT_JWKS_URL:
            headers = jwt.get_unverified_header(token)
            kid = headers.get('kid')
            jwks = _load_jwks() or {}
            keys = jwks.get('keys', [])
            key = next((k for k in keys if k.get('kid') == kid), None)
            if not key:
                return None
            public_key = jwk.construct(key)
            message, encoded_signature = token.rsplit('.', 1)
            decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
            if not public_key.verify(message.encode('utf-8'), decoded_signature):
                return None
            claims = jwt.get_unverified_claims(token)
            iss = settings.JWT_ISSUER
            aud = settings.JWT_AUDIENCE
            if iss and claims.get('iss') != iss:
                return None
            if aud and aud not in (claims.get('aud') if isinstance(claims.get('aud'), list) else [claims.get('aud')]):
                return None
            if 'exp' in claims and time.time() > float(claims['exp']):
                return None
            return claims
        elif settings.JWT_PUBLIC_KEY:
            claims = jwt.decode(token, settings.JWT_PUBLIC_KEY, algorithms=algos or ['RS256'], audience=settings.JWT_AUDIENCE, issuer=settings.JWT_ISSUER)
            return claims
        elif settings.JWT_SHARED_SECRET:
            claims = jwt.decode(token, settings.JWT_SHARED_SECRET, algorithms=algos or ['HS256'], audience=settings.JWT_AUDIENCE, issuer=settings.JWT_ISSUER)
            return claims
        else:
            # Dev fallback: return unverified claims
            return jwt.get_unverified_claims(token)
    except Exception:
        return None
