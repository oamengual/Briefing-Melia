import reflex as rx
from .state.base import State
from .pages.dashboard import dashboard
from .pages.editor import editor
from .styles import STYLESHEETS, BASE_STYLE

# Define the app
app = rx.App(
    style=BASE_STYLE,
    stylesheets=STYLESHEETS,
)

# Add pages
app.add_page(dashboard, route="/", title="Dashboard - Briefing Station")
app.add_page(editor, route="/editor/[id]", title="Editor - Briefing Station")
