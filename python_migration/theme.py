from nicegui import ui

THEME = {
    'primary': '#e4002b',
    'background': '#09090b',
    'foreground': '#fafafa',
    'card': '#1C1C21',
    'border': '#212126',
    'muted': '#747686',
}

def apply_global_styles():
    ui.add_head_html(f'''
    <style>
        @font-face {{
            font-family: "Foco";
            src: url("assets/fonts/foco-regular.ttf") format("truetype");
            font-weight: 400;
        }}
        @font-face {{
            font-family: "Foco";
            src: url("assets/fonts/foco-bold.ttf") format("truetype");
            font-weight: 700;
        }}
        body {{
            background-color: {THEME['background']};
            color: {THEME['foreground']};
            font-family: "Foco", "Inter", sans-serif;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }}
        .shadow-card {{
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(34, 42, 53, 0.04), 0 0 1px rgba(0, 0, 0, 0.1);
        }}
        /* Customize scrollbars to match dark theme */
        ::-webkit-scrollbar {{
            width: 8px;
            height: 8px;
        }}
        ::-webkit-scrollbar-track {{
            background: #09090b;
        }}
        ::-webkit-scrollbar-thumb {{
            background: #212126;
            border-radius: 4px;
        }}
        ::-webkit-scrollbar-thumb:hover {{
            background: #2d2d35;
        }}
    </style>
    ''', shared=True)
