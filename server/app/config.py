from pydantic import BaseSettings, AnyHttpUrl
from typing import List, Optional
import os

class Settings(BaseSettings):
    ENV: str = os.getenv('ENV', 'dev')
    DEBUG: bool = os.getenv('DEBUG', 'false').lower() == 'true'
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')

    # Comma-separated list of origins or '*'
    CORS_ORIGINS: str = os.getenv('CORS_ORIGINS', '*')
    TRUSTED_HOSTS: str = os.getenv('TRUSTED_HOSTS', '*')
    FORCE_HTTPS: bool = os.getenv('FORCE_HTTPS', 'false').lower() == 'true'

    REQUEST_ID_HEADER: str = os.getenv('REQUEST_ID_HEADER', 'X-Request-Id')

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

    def cors_origins(self) -> List[str]:
        raw = (self.CORS_ORIGINS or '').strip()
        return ['*'] if raw in ('', '*') else [x.strip() for x in raw.split(',') if x.strip()]

    def trusted_hosts(self) -> List[str]:
        raw = (self.TRUSTED_HOSTS or '').strip()
        return ['*'] if raw in ('', '*') else [x.strip() for x in raw.split(',') if x.strip()]

    # JWT verification
    JWT_ISSUER: str | None = os.getenv('JWT_ISSUER')
    JWT_AUDIENCE: str | None = os.getenv('JWT_AUDIENCE')
    JWT_JWKS_URL: str | None = os.getenv('JWT_JWKS_URL')
    JWT_PUBLIC_KEY: str | None = os.getenv('JWT_PUBLIC_KEY')
    JWT_SHARED_SECRET: str | None = os.getenv('JWT_SHARED_SECRET')
    JWT_ALGORITHMS: str = os.getenv('JWT_ALGORITHMS', 'RS256,HS256')
    LOG_FORMAT: str = os.getenv(''LOG_FORMAT'', ''text'')  # text | json
    LOG_FILE_PATH: str | None = os.getenv(''LOG_FILE_PATH'')
    LOG_MAX_BYTES: int = int(os.getenv(''LOG_MAX_BYTES'', ''10485760''))
    LOG_BACKUP_COUNT: int = int(os.getenv(''LOG_BACKUP_COUNT'', ''5''))
settings = Settings()


