from nicegui import ui
import json
from theme import THEME
from logic.briefing_store import store

def export_manager():
    with ui.column().classes('w-full max-w-4xl mx-auto py-8 gap-8'):
        # Header
        with ui.column().classes('gap-1'):
            ui.label('Export Campaign').classes('text-2xl font-bold text-slate-900')
            ui.label('Download campaign data and generated assets feeds.').classes('text-sm text-slate-500 font-medium')

        with ui.grid(columns=2).classes('w-full gap-6'):
            # Data Export Card
            with ui.card().classes('p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow'):
                with ui.column().classes('gap-4'):
                    with ui.row().classes('items-center gap-3'):
                        ui.icon('database', color='primary', size='md').classes('bg-red-50 p-2 rounded-xl')
                        with ui.column().classes('gap-0'):
                            ui.label('Campaign Data').classes('text-lg font-bold text-slate-900')
                            ui.label('Full backup in JSON format').classes('text-xs text-slate-400 font-medium')
                    
                    ui.label('Download the complete campaign configuration, including market selections, creative content, and translations.').classes('text-sm text-slate-500 leading-relaxed')
                    
                    def download_json():
                        try:
                            data = store.to_dict()
                            content = json.dumps(data, indent=2)
                            filename = f"campaign_{store.details.campaignName.lower().replace(' ', '_') or 'draft'}.json"
                            ui.download(content.encode('utf-8'), filename)
                            ui.notify('Campaign data exported successfully', color='positive')
                        except Exception as e:
                            ui.notify(f'Export failed: {str(e)}', color='negative')

                    ui.button('Download JSON', icon='download', on_click=download_json).classes(f'w-full bg-[{THEME["primary"]}] text-white font-bold rounded-xl h-12 shadow-lg shadow-red-100')

            # Photoshop Feed Card
            with ui.card().classes('p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow'):
                with ui.column().classes('gap-4'):
                    with ui.row().classes('items-center gap-3'):
                        ui.icon('image', color='primary', size='md').classes('bg-red-50 p-2 rounded-xl')
                        with ui.column().classes('gap-0'):
                            ui.label('Photoshop Data').classes('text-lg font-bold text-slate-900')
                            ui.label('CSV for automated creative production').classes('text-xs text-slate-400 font-medium')
                    
                    ui.label('Export a CSV file formatted for Photoshop variables. Includes all creative copy, CTA, and USPs for each market.').classes('text-sm text-slate-500 leading-relaxed')
                    
                    def download_photoshop_csv():
                        try:
                            content = store.generate_csv('creative')
                            filename = f"photoshop_feed_{store.details.campaignName.lower().replace(' ', '_') or 'draft'}.csv"
                            ui.download(content.encode('utf-8'), filename)
                            ui.notify('Photoshop feed exported successfully', color='positive')
                        except Exception as e:
                            ui.notify(f'Export failed: {str(e)}', color='negative')

                    ui.button('Download Photoshop CSV', icon='download', on_click=download_photoshop_csv).classes(f'w-full bg-[{THEME["primary"]}] text-white font-bold rounded-xl h-12 shadow-lg shadow-red-100')

        # Advanced Export Area
        with ui.column().classes('w-full p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 gap-4 mt-4'):
            with ui.row().classes('items-center gap-3'):
                ui.icon('info', size='xs').classes('text-slate-400')
                ui.label('Looking for Media Assets?').classes('text-sm font-bold text-slate-700')
            ui.label('Asset naming and trafficking feeds are available in the Feeds tab for high-volume campaign management.').classes('text-sm text-slate-500')
            ui.button('View Feeds & Proofs', on_click=lambda: ui.open('/briefing-new?tab=Feeds')).props('flat dense').classes('text-[10px] uppercase font-black tracking-widest text-[#f01c24]')
