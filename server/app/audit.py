import json
import logging
from typing import Any, Dict

audit_logger = logging.getLogger('audit')\nfrom .mask import mask_dict


def audit(event: str, **fields: Any) -> None:
    record: Dict[str, Any] = { 'event': event }\n    record.update(mask_dict(fields))
    try:
        audit_logger.info(json.dumps(record, ensure_ascii=False))
    except Exception:
        audit_logger.info({'event': event, **fields})

