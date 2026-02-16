import reflex as rx
from ..styles import *

def dashboard_header(total_campaigns: int) -> rx.Component:
    return rx.hstack(
        rx.box(
            rx.heading("Briefing Station", size="5", weight="bold"),
            rx.text(f"{total_campaigns} Active Campaigns", size="2", color=MUTED_FOREGROUND),
        ),
        rx.spacer(),
        rx.hstack(
            rx.button("New Campaign", color_scheme="red", radius="full"),
            rx.avatar(fallback="OA", radius="full"),
            spacing="4",
        ),
        width="100%",
        padding_y="4",
        align="center",
    )
