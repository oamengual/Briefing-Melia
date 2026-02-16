import reflex as rx
from ..styles import *

def toolbar() -> rx.Component:
    return rx.hstack(
        rx.hstack(
            rx.icon_button("mouse_pointer_2", variant="soft", size="2"),
            rx.icon_button("hand", variant="ghost", size="2"),
            rx.icon_button("type", variant="ghost", size="2"),
            spacing="1",
            background_color=rx.color_mode_cond(light=ACCENT_LIGHT, dark=ACCENT_DARK),
            padding="1",
            border_radius="md",
        ),
        rx.separator(orientation="vertical"),
        rx.hstack(
            rx.text("100%", size="1", width="40px", align="center"),
            rx.icon_button("minus", variant="ghost", size="1"),
            rx.icon_button("plus", variant="ghost", size="1"),
            spacing="1",
        ),
        spacing="4",
        align="center",
    )
