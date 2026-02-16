import reflex as rx
from ..state.base import State
from ..components.dashboard_header import dashboard_header
from ..components.stats_grid import stats_grid
from ..components.brief_grid import brief_grid

def dashboard() -> rx.Component:
    return rx.container(
        rx.vstack(
            dashboard_header(12),
            rx.separator(size="4"),
            stats_grid(),
            rx.heading("Recent Briefs", size="4", margin_top="4"),
            brief_grid(),
            spacing="6",
            width="100%",
            padding_y="6",
        ),
        size="4",
    )
