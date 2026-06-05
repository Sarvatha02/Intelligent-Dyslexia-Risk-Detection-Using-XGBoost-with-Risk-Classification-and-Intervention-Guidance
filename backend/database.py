import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load .env relative to this file's directory, regardless of working directory
_env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_db():
    return supabase
