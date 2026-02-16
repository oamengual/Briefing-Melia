import reflex as rx

class State(rx.State):
    """The base state for the app."""
    sidebar_open: bool = True

    def toggle_sidebar(self):
        self.sidebar_open = not self.sidebar_open
