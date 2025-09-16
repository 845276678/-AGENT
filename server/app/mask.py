import re

def mask_email(s: str) -> str:
    m = re.match(r"([^@]{1,3})([^@]*)(@.+)$", s)
    if not m: return s
    return m.group(1) + '*' * len(m.group(2)) + m.group(3)

def mask_token(s: str) -> str:
    if len(s) <= 8: return '*' * len(s)
    return s[:4] + '*' * (len(s)-8) + s[-4:]

def mask_generic(s: str) -> str:
    if len(s) <= 2: return '*' * len(s)
    return s[0] + '*' * (len(s)-2) + s[-1]

def mask_field(key: str, val):
    if not isinstance(val, str):
        return val
    k = key.lower()
    if 'password' in k:
        return '*' * len(val)
    if 'token' in k or 'secret' in k:
        return mask_token(val)
    if 'email' in k:
        return mask_email(val)
    if 'card' in k or 'phone' in k:
        return mask_generic(val)
    return val

def mask_dict(d: dict) -> dict:
    return { k: mask_field(k, v) for k, v in d.items() }
