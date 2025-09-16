import os
import json
from fastapi.testclient import TestClient
from server.app.main import app

client = TestClient(app)

def test_health():
    r = client.get('/healthz')
    assert r.status_code == 200
    assert r.json().get('ok') is True


def test_rate_limit_headers():
    r = client.get('/v1/stats/platform')
    assert r.status_code == 200
    assert 'X-RateLimit-Limit' in r.headers
    assert 'X-Request-Id' in r.headers


def test_idempotency_messages():
    # First call should succeed and cache
    headers = { 'Idempotency-Key': 'test-key-123' }
    r1 = client.post('/v1/discussions/abc/messages', json={'content':'hi'}, headers=headers)
    assert r1.status_code == 200
    r2 = client.post('/v1/discussions/abc/messages', json={'content':'hi'}, headers=headers)
    assert r2.status_code == 200
    # Response should be identical
    assert r1.json() == r2.json()
