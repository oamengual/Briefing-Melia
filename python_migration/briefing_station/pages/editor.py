import reflex as rx
from ...styles import *
from ..components.editor.toolbar import toolbar
from ..components.editor.layer_panel import layer_panel

def editor() -> rx.Component:
    return rx.vstack(
        # Top Bar
        rx.hstack(
            rx.button(rx.icon("chevron_left"), variant="ghost", size="2"),
            rx.text("Summer Campaign", weight="bold"),
            rx.spacer(),
            toolbar(),
            rx.spacer(),
            rx.button("Export", size="2"),
            width="100%",
            height="50px",
            border_bottom=f"1px solid {rx.color_mode_cond(light=BORDER_LIGHT, dark=BORDER_DARK)}",
            padding_x="4",
            align="center",
            background_color=rx.color_mode_cond(light=BACKGROUND_LIGHT, dark=BACKGROUND_DARK),
        ),
        # Main Area
        rx.hstack(
            # Left Sidebar (Layers)
            rx.vstack(
                rx.hstack(rx.icon("layers", size=14), rx.text("LAYERS", size="1", weight="bold"), padding="2", border_bottom=f"1px solid {BORDER_DARK}"),
                layer_panel(),
                width="280px",
                height="100%",
                border_right=f"1px solid {rx.color_mode_cond(light=BORDER_LIGHT, dark=BORDER_DARK)}",
                background_color=rx.color_mode_cond(light=BACKGROUND_LIGHT, dark=BACKGROUND_DARK),
            ),
            # Center Canvas
            rx.box(
                # Canvas Mockup
                rx.center(
                    rx.box(
                        width="600px",
                        height="400px",
                        background_color="white",
                        box_shadow="lg",
                    ),
                    width="100%",
                    height="100%",
                ),
                width="100%",
                height="100%",
                background_color=rx.color_mode_cond(light=MUTED_LIGHT, dark=MUTED_DARK),
            ),
            # Right Sidebar (Properties)
            rx.vstack(
                rx.hstack(rx.icon("settings_2", size=14), rx.text("PROPERTIES", size="1", weight="bold"), padding="2", border_bottom=f"1px solid {BORDER_DARK}"),
                rx.text("No Selection", size="2", padding="4", color=MUTED_FOREGROUND),
                width="280px",
                height="100%",
                border_left=f"1px solid {rx.color_mode_cond(light=BORDER_LIGHT, dark=BORDER_DARK)}",
                background_color=rx.color_mode_cond(light=BACKGROUND_LIGHT, dark=BACKGROUND_DARK),
            ),
            width="100%",
            height="calc(100vh - 50px)",
            align="start",
            spacing="0",
        ),
        spacing="0",
        width="100vw",
        height="100vh",
        overflow="hidden",
    )
