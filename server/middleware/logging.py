"""
Structured logging middleware for UniVerse ERP API.

Logs every request with method, path, status, duration, and user context.
Uses correlation IDs for request tracing.
"""
import time
import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Configure structured logger
logger = logging.getLogger("universe.api")
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter(
    "[%(asctime)s] %(levelname)s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
))
if not logger.handlers:
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Logs every API request with timing and correlation ID."""

    async def dispatch(self, request: Request, call_next):
        correlation_id = str(uuid.uuid4())[:8]
        start_time = time.time()

        # Extract user info from auth header (if present)
        auth_header = request.headers.get("authorization", "")
        has_auth = bool(auth_header)

        # Store correlation ID for downstream use
        request.state.correlation_id = correlation_id

        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 1)

            # Add correlation ID to response
            response.headers["X-Correlation-ID"] = correlation_id

            # Log the request
            status = response.status_code
            level = logging.WARNING if status >= 400 else logging.INFO

            logger.log(
                level,
                f"[{correlation_id}] {request.method} {request.url.path} "
                f"-> {status} ({duration_ms}ms) "
                f"{'[AUTH]' if has_auth else '[ANON]'}"
            )

            return response

        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 1)
            logger.error(
                f"[{correlation_id}] {request.method} {request.url.path} "
                f"-> 500 ({duration_ms}ms) ERROR: {type(e).__name__}: {e}"
            )
            raise
