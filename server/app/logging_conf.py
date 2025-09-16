import json
import logging
import sys
from logging.handlers import RotatingFileHandler
from .config import settings

class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        base = {
            'ts': self.formatTime(record, datefmt='%Y-%m-%dT%H:%M:%S'),
            'level': record.levelname,
            'logger': record.name,
            'msg': record.getMessage(),
        }
        return json.dumps(base, ensure_ascii=False)


def setup_logging():
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    root = logging.getLogger()
    root.setLevel(level)

    fmt = JsonFormatter() if settings.LOG_FORMAT.lower() == 'json' else logging.Formatter('%(asctime)s %(levelname)s [%(name)s] %(message)s')
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(fmt)
    handlers = [stream_handler]

    if settings.LOG_FILE_PATH:
      file_handler = RotatingFileHandler(settings.LOG_FILE_PATH, maxBytes=settings.LOG_MAX_BYTES, backupCount=settings.LOG_BACKUP_COUNT)
      file_handler.setFormatter(fmt)
      handlers.append(file_handler)

    root.handlers = handlers
    for name in ('app','audit','access'):
        logging.getLogger(name).setLevel(level)
