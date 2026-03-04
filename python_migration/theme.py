from nicegui import ui

# Design Tokens (Strict Light Mode)
THEME = {
    'primary': '#e4002b',    # Target Red
    'background': '#f7f7f8', # #F7F7F8
    'foreground': '#212126', # #212126
    'card': '#ffffff',
    'border': '#dfe1e6',     # #DFE1E6
    'muted': '#747686',      # #747686
    'zinc_50': '#fafafa',
    'zinc_100': '#f4f4f5',
}

def apply_global_styles():
    # Globally override Quasar primary color
    ui.colors(primary=THEME['primary'])
    
    ui.add_head_html(f'''
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        /* Font Foco (Simulated with Inter for now if files missing, but adding the structure) */
        @font-face {{
            font-family: 'Foco';
            src: url('/fonts/foco-regular.ttf') format('truetype');
            font-weight: 400;
            font-style: normal;
        }}
        @font-face {{
            font-family: 'Foco';
            src: url('/fonts/foco-bold.ttf') format('truetype');
            font-weight: 700;
            font-style: normal;
        }}

        body {{
            background-color: {THEME['background']};
            color: {THEME['foreground']};
            font-family: 'Foco', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }}
        
        .radius-card {{ border-radius: 12px; }}
        .radius-btn {{ border-radius: 6px; }}
        .radius-input {{ border-radius: 6px; }}
        
        .shadow-sm {{ box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }}
        .shadow-card {{ box-shadow: 0 2px 3px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(34, 42, 53, 0.04), 0 0 1px rgba(0, 0, 0, 0.1); }}
        
        /* Custom Scrollbars */
        ::-webkit-scrollbar {{ width: 8px; height: 8px; }}
        ::-webkit-scrollbar-track {{ background: {THEME['background']}; }}
        ::-webkit-scrollbar-thumb {{ background: #cbd5e1; border-radius: 10px; border: 2px solid {THEME['background']}; }}
        ::-webkit-scrollbar-thumb:hover {{ background: #94a3b8; }}

        /* Quasar Overrides */
        .q-field--outlined .q-field__control:before {{ border-color: {THEME['border']}; }}
        .q-field--outlined .q-field__control:hover:before {{ border-color: #cbd5e1; }}
        .q-tab--active {{ color: {THEME['primary']} !important; font-weight: 700 !important; }}
        .q-tab__indicator {{ height: 3px !important; background-color: {THEME['primary']} !important; }}
        
        /* Utility Classes */
        .premium-card {{
            background: {THEME['card']};
            border: 1px solid {THEME['border']};
            border-radius: 12px;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.04);
            transition: all 0.3s ease;
        }}
        .premium-card:hover {{
            box-shadow: 0 4px 6px rgba(34, 42, 53, 0.06);
            border-color: {THEME['primary']}33;
        }}
    </style>
    ''', shared=True)
