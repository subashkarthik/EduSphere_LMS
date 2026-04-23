"""
Rate limiting middleware for UniVerse ERP API.

Uses a sliding window counter to limit requests per IP address.
Default: 100 requests/minute general, 5 requests/minute for auth endpoints.
"""
import time
from collections import defaultdict
from typing import Dict, Tuple
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


class RateLimitMiddleware(BaseHTTPMiddleware):
    """In-memory sliding window rate limiter."""

    def __init__(
        self,
        app,
        general_limit: int = 100,
        auth_limit: int = 10,
        window_seconds: int = 60,
    ):
        super().__init__(app)
        self.general_limit = general_limit
        self.auth_limit = auth_limit
        self.window_seconds = window_seconds
        # {ip: [(timestamp, count), ...]}
        self._requests: Dict[str, list] = defaultdict(list)

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request, supporting reverse proxies."""
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    def _is_rate_limited(self, ip: str, is_auth: bool) -> Tuple[bool, int]:
        """Check if IP exceeds rate limit. Returns (is_limited, remaining)."""
        now = time.time()
        limit = self.auth_limit if is_auth else self.general_limit
        key = f"{ip}:auth" if is_auth else ip

        # Clean old entries outside the window
        self._requests[key] = [
            t for t in self._requests[key]
            if now - t < self.window_seconds
        ]

        current_count = len(self._requests[key])
        remaining = max(0, limit - current_count)

        if current_count >= limit:
            return True, 0

        self._requests[key].append(now)
        return False, remaining - 1

    async def dispatch(self, request: Request, call_next):
        ip = self._get_client_ip(request)
        is_auth = request.url.path.startswith("/api/auth")

        is_limited, remaining = self._is_rate_limited(ip, is_auth)

        if is_limited:
            limit = self.auth_limit if is_auth else self.general_limit
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded. Please try again later.",
                    "retry_after_seconds": self.window_seconds,
                },
                headers={
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(self.window_seconds),
                    "Retry-After": str(self.window_seconds),
                },
            )

        response = await call_next(request)

        limit = self.auth_limit if is_auth else self.general_limit
        response.headers["X-RateLimit-Limit"] = str(limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response
