"""
database.py — PostgreSQL connection and precedents CRUD via asyncpg.

Strategy: On app startup, all precedents are loaded from the DB into an
in-memory dict. This means zero per-request DB latency for precedent
lookups (they change rarely), while keeping the data in a proper,
manageable database.
"""
import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

# Module-level connection pool
_pool: asyncpg.Pool | None = None


async def connect_db() -> None:
    """Create the asyncpg connection pool."""
    global _pool
    _pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)


async def disconnect_db() -> None:
    """Close the connection pool on shutdown."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


async def create_precedents_table() -> None:
    """Create the precedents table if it doesn't already exist."""
    async with _pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS precedents (
                id           SERIAL PRIMARY KEY,
                category_key VARCHAR(100) UNIQUE NOT NULL,
                title        TEXT NOT NULL,
                citation     TEXT NOT NULL,
                text         TEXT NOT NULL,
                created_at   TIMESTAMPTZ DEFAULT NOW()
            )
        """)


async def load_all_precedents() -> dict:
    """
    Fetch every row from the precedents table and return a dict
    keyed by category_key — same shape as the old PRECEDENTS_DB dict.
    """
    async with _pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT category_key, title, citation, text FROM precedents ORDER BY id"
        )
    return {
        row["category_key"]: {
            "title":    row["title"],
            "citation": row["citation"],
            "text":     row["text"],
        }
        for row in rows
    }


async def upsert_precedent(
    category_key: str,
    title: str,
    citation: str,
    text: str,
) -> None:
    """Insert or update a single precedent row."""
    async with _pool.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO precedents (category_key, title, citation, text)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (category_key) DO UPDATE
                SET title    = EXCLUDED.title,
                    citation = EXCLUDED.citation,
                    text     = EXCLUDED.text
            """,
            category_key, title, citation, text,
        )
