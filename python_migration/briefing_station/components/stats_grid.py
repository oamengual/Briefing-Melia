import reflex as rx
from ..styles import *

def stat_card(label: str, value: str, trend: str = None) -> rx.Component:
    return rx.box(
        rx.vstack(
            rx.text(label, size="2", color=MUTED_FOREGROUND, weight="medium"),
            rx.text(value, size="6", weight="bold"),
            rx.cond(
                trend is not None,
                rx.text(trend, size="1", color="green"),
            ),
            spacing="1",
        ),
        background_color=rx.color_mode_cond(light=CARD_LIGHT, dark=CARD_DARK),
        border=f"1px solid {rx.color_mode_cond(light=BORDER_LIGHT, dark=BORDER_DARK)}",
        padding="4",
        border_radius="lg",
        width="100%",
    )

def stats_grid() -> rx.Component:
    return rx.grid(
        stat_card("Active Campaigns", "12", "+2 this week"),
        stat_card("Total Assets Generated", "1,240", "12% increase"),
        stat_card("Avg. Markets per Brief", "4"),
        stat_card("Top Channel", "Social Media"),
        columns="4",
        spacing="4",
        width="100%",
    )
