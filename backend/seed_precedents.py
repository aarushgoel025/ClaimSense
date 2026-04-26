"""
seed_precedents.py — One-time script to migrate the hardcoded PRECEDENTS_DB
dict into the PostgreSQL database.

Run once AFTER you have set DATABASE_URL in backend/.env:

    python seed_precedents.py

It is safe to run multiple times — it uses ON CONFLICT DO UPDATE (upsert),
so it will never create duplicate rows.
"""
import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Import the legacy dict — this is the source of truth for the seed
from precedents_db import PRECEDENTS_DB

load_dotenv()


async def seed():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("❌ ERROR: DATABASE_URL is not set in your .env file.")
        print("   Please add it and try again.")
        return

    print(f"🔗 Connecting to PostgreSQL...")
    conn = await asyncpg.connect(database_url)

    # ── Create table ─────────────────────────────────────────────────────
    print("📦 Creating 'precedents' table (if it doesn't exist)...")
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

    # ── Seed all precedents ───────────────────────────────────────────────
    print(f"\n🌱 Seeding {len(PRECEDENTS_DB)} precedents...\n")
    for key, data in PRECEDENTS_DB.items():
        await conn.execute(
            """
            INSERT INTO precedents (category_key, title, citation, text)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (category_key) DO UPDATE
                SET title    = EXCLUDED.title,
                    citation = EXCLUDED.citation,
                    text     = EXCLUDED.text
            """,
            key,
            data["title"],
            data["citation"],
            data["text"],
        )
        print(f"   ✅ {key}")

    await conn.close()
    print(f"\n🎉 Done! {len(PRECEDENTS_DB)} precedents seeded to PostgreSQL.")
    print("   You can now view them in your Supabase dashboard under Table Editor → precedents")


if __name__ == "__main__":
    asyncio.run(seed())
