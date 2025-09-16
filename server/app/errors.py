import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings

logger = logging.getLogger('app')


def api_error(code: str, message: str, status_code: int = 400, details=None):
    return JSONResponse(
        status_code=status_code,
        content={
            'success': False,
            'error': {
                'code': code,
                'message': message,
                'details': details or {},
            }
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning('HTTPException: %s %s -> %s', request.method, request.url.path, exc.detail)
    return api_error(code=f'HTTP.{exc.status_code}', message=str(exc.detail), status_code=exc.status_code)


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info('ValidationError: %s %s', request.method, request.url.path)
    return api_error(code='VALIDATION.ERROR', message='参数校验失败', status_code=422, details={'errors': exc.errors()})


async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception('Unhandled error on %s %s', request.method, request.url.path)
    return api_error(code='INTERNAL.ERROR', message='服务器内部错误', status_code=500)
