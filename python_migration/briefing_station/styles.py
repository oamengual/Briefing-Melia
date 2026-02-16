
# 1. Colors (Clerk/Shadcn Palette)
BACKGROUND_LIGHT = "#F7F7F8"
BACKGROUND_DARK = "#09090b"
FOREGROUND_LIGHT = "#212126"
FOREGROUND_DARK = "#F7F7F8"

CARD_LIGHT = "#FFFFFF"
CARD_DARK = "#1C1C21"

PRIMARY = "#e4002b"
PRIMARY_FOREGROUND = "#FFFFFF"

MUTED_LIGHT = "#F7F7F8"
MUTED_DARK = "#212126"
MUTED_FOREGROUND = "#747686"

BORDER_LIGHT = "#DFE1E6"
BORDER_DARK = "#212126"

# 2. Typography
FONT_FAMILY = "Foco, Inter, sans-serif"

# 3. Base Style
BASE_STYLE = {
    "font_family": FONT_FAMILY,
    "background_color": rx.color_mode_cond(light=BACKGROUND_LIGHT, dark=BACKGROUND_DARK),
    "color": rx.color_mode_cond(light=FOREGROUND_LIGHT, dark=FOREGROUND_DARK),
}

# 4. Stylesheets
STYLESHEETS = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "/fonts/foco-regular.ttf", 
    "/fonts/foco-bold.ttf",
]
