import hashlib
import secrets
import hmac


def hash_password(password: str) -> str:
    """Hash a plain text password using PBKDF2-SHA256 (stdlib, no external deps)."""
    salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 260000)
    return f"pbkdf2:sha256:260000${salt}${dk.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a PBKDF2-SHA256 hash."""
    try:
        parts = hashed_password.split("$")
        if len(parts) != 3:
            return False
        _, salt, expected_hash = parts
        dk = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 260000)
        return hmac.compare_digest(dk.hex(), expected_hash)
    except Exception:
        return False
