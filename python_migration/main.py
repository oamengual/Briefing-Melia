from nicegui import ui
from theme import apply_global_styles
from pages.dashboard import dashboard_page
from pages.editor import editor_page

# Apply high-fidelity styles
apply_global_styles()

# Pages are registered automatically by their decorators or we can call them
# But in NiceGUI, @ui.page is the easiest way.
# We'll just import them to ensure the decorators are executed.

# Start the app
ui.run(
    port=3005, 
    title='Briefing Station V3', 
    dark=True, 
    reload=True, 
    show=False,
    storage_secret='briefing_station_secret'
)
