import reflex as rx
from ..styles import *

def brief_card(name: str, status: str, market: str) -> rx.Component:
    return rx.box(
        rx.vstack(
            rx.hstack(
                rx.badge(status, color_scheme="green" if status == "Active" else "gray"),
                rx.spacer(),
                rx.menu.root(
                    rx.menu.trigger(
                        rx.icon("more_horizontal", size=16),
                    ),
                    rx.menu.content(
                        rx.menu.item("Edit"),
                        rx.menu.item("Duplicate"),
                        rx.menu.separator(),
                        rx.menu.item("Delete", color="red"),
                    ),
                ),
                width="100%",
            ),
            rx.text(name, weight="bold", size="4"),
            rx.text(market, size="2", color=MUTED_FOREGROUND),
            align="start",
            spacing="3",
        ),
        background_color=rx.color_mode_cond(light=CARD_LIGHT, dark=CARD_DARK),
        border=f"1px solid {rx.color_mode_cond(light=BORDER_LIGHT, dark=BORDER_DARK)}",
        padding="4",
        border_radius="lg",
        cursor="pointer",
        _hover={
            "border_color": PRIMARY,
        },
    )

def brief_grid() -> rx.Component:
    # TODO: Connect to state
    return rx.grid(
        brief_card("Summer Campaign 2024", "Active", "Global (DE, FR, UK)"),
        brief_card("Black Friday Prep", "Draft", "EU Only"),
        brief_card("Q3 Social Push", "Review", "NA (US, CA)"),
        columns="3",
        spacing="4",
        width="100%",
    )
