import os
import time
import asyncio
from typing import Optional
try:
    from redis import asyncio as aioredis
except ImportError:  # runtime fallback if redis not installed
    aioredis = None  # type: ignore


class _MemoryStore:
    def __init__(self):
        self._data = {}
        self._lock = asyncio.Lock()

    async def incr(self, key: str, ttl: int) -> int:
        async with self._lock:
            now = int(time.time())
            val, exp = self._data.get(key, (0, 0))
            if exp < now:
                val, exp = 0, now + ttl
            val += 1
            self._data[key] = (val, exp)
            return val

    async def get(self, key: str) -> Optional[str]:
        async with self._lock:
            now = int(time.time())
            item = self._data.get(key)
            if not item:
                return None
            val, exp = item
            if exp < now:
                self._data.pop(key, None)
                return None
            return val  # type: ignore[return-value]

    async def set(self, key: str, value: str, ttl: int) -> None:
        async with self._lock:
            exp = int(time.time()) + ttl
            self._data[key] = (value, exp)


class Storage:
    def __init__(self):
        self.redis_url = os.getenv('REDIS_URL')
        self.client = None
        if self.redis_url and aioredis is not None:
            self.client = aioredis.from_url(self.redis_url, encoding='utf-8', decode_responses=True)
        else:
            self.client = _MemoryStore()

    async def incr(self, key: str, ttl: int) -> int:
        if hasattr(self.client, 'incr') and hasattr(self.client, 'expire'):
            val = await self.client.incr(key)  # type: ignore[attr-defined]
            await self.client.expire(key, ttl)  # type: ignore[attr-defined]
            return int(val)
        return await self.client.incr(key, ttl)  # type: ignore[arg-type]

    async def get(self, key: str) -> Optional[str]:
        if hasattr(self.client, 'get') and not isinstance(self.client, _MemoryStore):
            return await self.client.get(key)  # type: ignore[attr-defined]
        return await self.client.get(key)  # type: ignore[attr-defined]

    async def set(self, key: str, value: str, ttl: int) -> None:
        if hasattr(self.client, 'setex'):
            await self.client.setex(key, ttl, value)  # type: ignore[attr-defined]
            return
        await self.client.set(key, value, ttl)  # type: ignore[arg-type]


storage = Storage()
