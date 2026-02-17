from nicegui import ui
from components.layout import layout_wrapper
from components.campaign_form import campaign_form
from components.market_matrix import market_matrix
from components.content_form import content_form
from theme import THEME

@ui.page('/briefing-new')
@ui.page('/briefing/{brief_id}')
def briefing_builder_page(brief_id: str = 'new'):
    with layout_wrapper():
        # Top Toolbar
        with ui.row().classes('w-full bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800 h-14 items-center justify-between px-6 sticky top-0 z-50'):
             with ui.row().classes('items-center gap-4'):
                 ui.button(icon='arrow_back', on_click=lambda: ui.open('/briefings')).props('flat round').classes('text-zinc-500')
                 with ui.column().classes('gap-0'):
                     with ui.row().classes('items-center gap-2'):
                         ui.label('Untitled Campaign' if brief_id == 'new' else brief_id.replace('-', ' ').title()).classes('text-sm font-bold text-white')
                         ui.badge('DRAFT', color='zinc-800').classes('text-[8px] font-black px-1.5')
                     ui.label('Last autosaved just now').classes('text-[9px] text-zinc-500 font-medium')
            
             with ui.row().classes('items-center gap-3'):
                 ui.button('Save Campaign', icon='save').classes(f'bg-[{THEME["primary"]}] rounded-lg px-6 font-bold text-xs h-9 shadow-lg').props('no-caps')

        # Sub-Navigation Tabs
        with ui.row().classes('w-full bg-[#09090b] border-b border-zinc-800/40 sticky top-14 z-40 items-center justify-center'):
            with ui.tabs().classes('h-12 bg-transparent') as tabs:
                ui.tab('Details')
                ui.tab('Market Mix')
                ui.tab('Content')
                ui.tab('Translations')
                ui.tab('Feeds')
                ui.tab('PSD Assets')
                ui.tab('Editor')
                ui.tab('History')

        # Content Area
        with ui.column().classes('w-full max-w-5xl mx-auto py-10 px-8'):
            with ui.tab_panels(tabs, value='Details').classes('w-full bg-transparent p-0'):
                with ui.tab_panel('Details'):
                    campaign_form()
                
                with ui.tab_panel('Market Mix'):
                    market_matrix()
                
                with ui.tab_panel('Content'):
                    content_form()
                
                # Add other panels as placeholders for now
                for t in ['Translations', 'Feeds', 'PSD Assets', 'Editor', 'History']:
                    with ui.tab_panel(t):
                         ui.label(f'{t} Section coming soon...').classes('text-zinc-500 italic text-center p-20')
