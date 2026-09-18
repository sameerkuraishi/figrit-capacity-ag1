"""One-command local setup for Windows/Linux/macOS after dependencies are installed."""
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "figr_backend.settings")

import django
django.setup()

from django.core.management import call_command

call_command("migrate", run_syncdb=True, interactive=False)
call_command("seed_demo")
print("\nBackend ready. Run: python manage.py runserver 8000")
