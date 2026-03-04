from nicegui import app, ui
from theme import apply_global_styles
from pages.dashboard import dashboard_page
from pages.editor import editor_page
from pages.briefings import briefings_page
from pages.settings import settings_page
from pages.calendar import calendar_page
from pages.templates import templates_page
from pages.briefing_builder import briefing_builder_page

# Register static assets
app.add_static_files('/assets', 'assets')

# Run the app
ui.run(port=3005, title='Briefing Station V3', dark=False, reload=True,
    show=False,
    storage_secret='briefing_station_secret'
)
