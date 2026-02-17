from nicegui import ui
from theme import THEME

def content_form():
    with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-0 rounded-xl shadow-card overflow-hidden'):
        with ui.row().classes('p-6 items-center gap-3 border-b border-zinc-800/50'):
            ui.icon('title', color='primary').classes('text-xl')
            ui.label('Creative Content & Copy').classes('text-lg font-bold')
        
        with ui.column().classes('p-6 gap-8'):
            with ui.tabs().classes('w-full bg-zinc-900/50 p-1 rounded-xl') as inner_tabs:
                ui.tab('Banners & Ads').classes('flex-1 rounded-lg text-xs font-bold uppercase tracking-widest')
                ui.tab('Landing Page').classes('flex-1 rounded-lg text-xs font-bold uppercase tracking-widest')
                ui.tab('Newsletter').classes('flex-1 rounded-lg text-xs font-bold uppercase tracking-widest')

            with ui.tab_panels(inner_tabs, value='Banners & Ads').classes('w-full bg-transparent p-0 mt-6'):
                # BANNERS TAB
                with ui.tab_panel('Banners & Ads'):
                    with ui.column().classes('w-full gap-6'):
                        # Headline
                        with ui.column().classes('w-full gap-2'):
                            with ui.row().classes('w-full justify-between items-center'):
                                ui.label('Main Claim / Headline').classes('text-xs font-bold text-zinc-400')
                                with ui.row().classes('items-center gap-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800'):
                                    ui.checkbox().props('size=xs')
                                    ui.label('LOCK').classes('text-[8px] font-black text-zinc-500')
                            ui.input(placeholder='Enter main headline...').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-11 px-4 text-base font-bold text-white')
                        
                        # CTA & Discount
                        with ui.grid(columns=2).classes('w-full gap-6'):
                            for label in ['Call to Action', 'Discount / Offer']:
                                with ui.column().classes('gap-2'):
                                    ui.label(label).classes('text-[10px] font-black uppercase text-zinc-500 tracking-widest')
                                    ui.input(placeholder=f'e.g. {"Shop Now" if "Call" in label else "50% OFF"}').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm font-bold')

                        ui.separator().classes('bg-zinc-800')

                        # USPs
                        with ui.grid(columns=3).classes('w-full gap-6'):
                            for i in range(1, 4):
                                with ui.column().classes('gap-2'):
                                    ui.label(f'USP {i}').classes('text-[10px] font-black uppercase text-zinc-500 tracking-widest')
                                    ui.input(placeholder=f'USP {i}').classes('w-full bg-zinc-900 border-zinc-800 rounded-lg h-10 px-4 text-sm')

                # LANDING PAGE TAB
                with ui.tab_panel('Landing Page'):
                    ui.label('Landing Page copy settings coming soon...').classes('text-zinc-500 italic text-center p-12')

                # NEWSLETTER TAB
                with ui.tab_panel('Newsletter'):
                    ui.label('Newsletter copy settings coming soon...').classes('text-zinc-500 italic text-center p-12')
