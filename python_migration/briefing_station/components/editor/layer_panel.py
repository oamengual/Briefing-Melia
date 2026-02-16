import reflex as rx
from ...styles import *

def layer_item(name: str, type: str, visible: bool = True, selected: bool = False) -> rx.Component:
    return rx.hstack(
        rx.icon("eye" if visible else "eye_off", size=14, color=MUTED_FOREGROUND),
        rx.icon("image" if type == "image" else "type", size=14),
        rx.text(name, size="2", weight="medium" if selected else "regular"),
        width="100%",
        padding="2",
        align="center",
        background_color=rx.color_mode_cond(light=ACCENT_LIGHT if selected else "transparent", dark=ACCENT_DARK if selected else "transparent"),
        border_radius="sm",
        cursor="pointer",
        _hover={
            "background_color": rx.color_mode_cond(light=ACCENT_LIGHT, dark=ACCENT_DARK),
        }
    )

def layer_panel() -> rx.Component:
    return rx.vstack(
        layer_item("Headline", "text", selected=True),
        layer_item("Product Image", "image"),
        layer_item("Background", "image"),
        layer_item("Logo Group", "group"),
        width="100%",
        spacing="1",
        padding="2",
    )
