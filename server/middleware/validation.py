"""
Input validation & sanitization middleware for UniVerse ERP API.

Strips common XSS patterns from request bodies and adds
security headers to all responses.
"""
import re
import json
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


# Patterns that indicate potential XSS or injection attempts
XSS_PATTERNS = [
    re.compile(r"<script\b[^>]*>", re.IGNORECASE),
    re.compile(r"javascript:", re.IGNORECASE),
    re.compile(r"on\w+\s*=", re.IGNORECASE),  # onclick=, onerror=, etc.
    re.compile(r"<iframe\b", re.IGNORECASE),
    re.compile(r"<object\b", re.IGNORECASE),
    re.compile(r"<embed\b", re.IGNORECASE),
]


def _sanitize_string(value: str) -> str:
    """Remove dangerous patterns from a string value."""
    for pattern in XSS_PATTERNS:
        value = pattern.sub("", value)
    return value.strip()


def _sanitize_value(value):
    """Recursively sanitize values in request data."""
    if isinstance(value, str):
        return _sanitize_string(value)
    elif isinstance(value, dict):
        return {k: _sanitize_value(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [_sanitize_value(item) for item in value]
    return value


class InputValidationMiddleware(BaseHTTPMiddleware):
    """Sanitizes incoming request bodies to prevent XSS injection."""

    async def dispatch(self, request: Request, call_next):
        # Only process JSON bodies on mutation methods
        if request.method in ("POST", "PUT", "PATCH"):
            content_type = request.headers.get("content-type", "")
            if "application/json" in content_type:
                try:
                    body = await request.body()
                    if body:
                        data = json.loads(body)
                        sanitized = _sanitize_value(data)

                        # Check if sanitization changed anything (potential attack)
                        if json.dumps(data, sort_keys=True) != json.dumps(sanitized, sort_keys=True):
                            print(f"[SECURITY] Sanitized suspicious input from {request.client.host if request.client else 'unknown'}: {request.url.path}")

                        # Reconstruct the request with sanitized body
                        async def receive():
                            return {"type": "http.request", "body": json.dumps(sanitized).encode()}

                        request._receive = receive
                except (json.JSONDecodeError, UnicodeDecodeError):
                    pass  # Let FastAPI handle malformed JSON

        return await call_next(request)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"

        return response
