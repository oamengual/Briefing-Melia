from nicegui import ui
from components.layout import layout_wrapper
from components.campaign_details import campaign_details
from components.market_matrix import market_matrix
from components.creative_content import creative_content
from components.feed_preview import feed_preview
from components.trafficking_manager import trafficking_manager
from components.psd_manager import psd_manager
from components.history_view import history_view
from components.export_manager import export_manager
from components.python_editor import python_editor
from theme import THEME
from logic.briefing_store import store
from logic.briefing_manager import BriefingManager

@ui.page('/briefing-new')
@ui.page('/briefing/{brief_id}')
def briefing_builder_page(brief_id: str = 'new'):
    # Initialize/Load state
    if brief_id == 'new':
        store.clear()
        # Ensure we have a clean slate but keeping defaults
    else:
        loaded = BriefingManager.get_brief(brief_id)
        if loaded:
            # We need to copy values from loaded store to the singleton 'store'
            # because existing components are bound to 'store' instance
            store.__dict__.update(loaded.__dict__)
        else:
            ui.notify('Campaign not found', type='negative')
            ui.open('/briefings')
            return

    with layout_wrapper():
        # Top Toolbar (Sticky)
        def save_brief():
            try:
                new_id = BriefingManager.save_brief(store)
                ui.notify(f"Campaign '{store.details.campaignName}' saved successfully!", color='positive', icon='check_circle')
                if brief_id == 'new':
                    ui.open(f'/briefing/{new_id}')
                # else:
                    # Refresh UI metadata (like updated_at label if we had one visible)
                    # pass
            except Exception as e:
                ui.notify(f'Save failed: {str(e)}', color='negative')

        with ui.header().classes(f'bg-white border-b border-slate-200 py-4 px-8 items-center justify-between text-slate-900 shadow-sm'):
            with ui.row().classes('items-center gap-4'):
                ui.button(icon='arrow_back', on_click=lambda: ui.open('/briefings')).props('flat color=slate-400')
                with ui.column().classes('gap-0'):
                    ui.label('Campaign Briefing Builder').classes('text-sm font-black uppercase tracking-widest text-slate-400')
                    ui.label(store.details.campaignName or 'Untitled Campaign').classes('text-xl font-bold text-slate-900').bind_text_from(store.details, 'campaignName', backward=lambda x: x or 'Untitled Campaign')
            
            with ui.row().classes('items-center gap-4'):
                ui.button('Save Campaign', icon='cloud_upload', on_click=save_brief).classes(f'bg-[{THEME["primary"]}] text-white font-bold rounded-xl px-6 h-11 shadow-lg shadow-red-100')
                with ui.row().classes('bg-slate-100 p-1 rounded-xl'):
                    ui.button(icon='more_vert').props('flat color=slate-400')

        # Sub-Navigation Tabs (Sticky below toolbar)
        with ui.row().classes('w-full bg-slate-50 border-b border-slate-200 sticky top-20 z-[90] items-center justify-center'):
            def handle_tab_change(e):
                # Trigger refreshes to ensure cross-tab reactivity (especially for regions/placements)
                market_matrix.refresh()
                creative_content.refresh()
                translations_manager.refresh()
                feed_preview.refresh()

            with ui.tabs(on_change=handle_tab_change).classes('h-14 bg-transparent w-full max-w-[1400px] px-10') as tabs:
                ui.tab('Details').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Market Mix').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Creative Content').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Translations').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Feeds').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('PSD Assets').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Editor').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Trafficking').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('Export').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')
                ui.tab('History').classes('text-[12px] font-bold tracking-tight px-6 h-full text-slate-500')

        # Content Area
        with ui.column().classes('w-full max-w-[1400px] mx-auto py-12 px-10'):
            with ui.tab_panels(tabs, value='Details').classes('w-full bg-transparent p-0'):
                with ui.tab_panel('Details'):
                    campaign_details()
                
                with ui.tab_panel('Market Mix'):
                    market_matrix()
                with ui.tab_panel('Creative Content'):
                    creative_content()
                with ui.tab_panel('Translations'):
                    translations_manager()
                with ui.tab_panel('Feeds'):
                    feed_preview()
                with ui.tab_panel('PSD Assets'):
                    psd_manager(brief_id)
                with ui.tab_panel('Editor').classes('p-0 gap-8 flex flex-col'): # Modified tab panel classes
                    python_editor() # Replaced content with python_editor()
                with ui.tab_panel('Trafficking'):
                    trafficking_manager()
                with ui.tab_panel('Export'):
                    export_manager()
                with ui.tab_panel('History'):
                    history_view()
