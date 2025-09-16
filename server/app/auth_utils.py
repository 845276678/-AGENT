import base64
import json
from typing import Optional
from fastapi import Request

def get_principal_from_request(request: Request) -> Optional[str]:
    auth = request.headers.get('Authorization') or ''
    if not auth.startswith('Bearer '):
        return None
    token = auth.split(' ',1)[1]
    try:
        parts = token.split('.')
        if len(parts) < 2:
            return None
        pad = '=' * (-len(parts[1]) % 4)
        payload = base64.urlsafe_b64decode(parts[1] + pad)
        data = json.loads(payload)
        return data.get('sub')
    except Exception:
        return None
