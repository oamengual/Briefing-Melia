from nicegui import ui
from components.layout import layout_wrapper
from theme import THEME

@ui.page('/briefings')
def briefings_page():
    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-zinc-800 bg-[#09090b]'):
            with ui.column().classes('gap-1'):
                ui.label('Campaign Briefings').classes('text-3xl font-bold tracking-tight')
                ui.label('Access and manage all your active and archived content campaigns.').classes('text-base text-zinc-500')
            
            with ui.row().classes('gap-4'):
                ui.button('Export', icon='download').props('outline').classes('border-zinc-800 text-zinc-400 font-bold h-11 px-6')
                ui.button('New Campaign', icon='add', on_click=lambda: ui.open('/briefing-new')).classes(f'bg-[{THEME["primary"]}] rounded-lg px-6 font-bold shadow-lg h-11')

        # Content Area
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-10'):
            # Stats (Mini Cards)
            with ui.grid(columns=4).classes('w-full gap-4'):
                for label, value, color in [
                    ('All Briefs', '12', 'white'),
                    ('Drafts', '4', 'zinc-500'),
                    ('Active', '6', 'blue-500'),
                    ('Completed', '2', 'teal-500'),
                ]:
                    with ui.card().classes('bg-[#1C1C21] border-[#212126] p-4 gap-0 shadow-card rounded-xl'):
                        ui.label(label).classes('text-[10px] font-black uppercase tracking-widest text-zinc-500')
                        ui.label(value).classes(f'text-2xl font-bold text-{color}')

            # Filters & Search
            with ui.row().classes('w-full justify-between items-center border-b border-zinc-800 pb-6'):
                with ui.tabs().classes('bg-transparent') as tabs:
                    ui.tab('All')
                    ui.tab('Drafts')
                    ui.tab('Active')
                    ui.tab('Completed')
                
                with ui.row().classes('items-center gap-3'):
                    with ui.row().classes('relative items-center'):
                        ui.icon('search').classes('absolute left-3 text-zinc-500 z-10')
                        ui.input(placeholder='Search campaigns').classes('bg-zinc-900 border-zinc-800 rounded-lg h-10 pl-10 w-64 text-sm')
                    ui.select(['Last Updated', 'Name (A-Z)', 'Asset Count'], value='Last Updated').classes('bg-zinc-900 border-zinc-800 rounded-lg h-10 w-40 text-sm')

            # Briefings Table
            with ui.card().classes('w-full bg-[#1C1C21] border-[#212126] p-0 rounded-xl shadow-card overflow-hidden'):
                columns = [
                    {'name': 'name', 'label': 'Campaign Name', 'field': 'name', 'required': True, 'align': 'left'},
                    {'name': 'brand', 'label': 'Brand', 'field': 'brand', 'align': 'left'},
                    {'name': 'status', 'label': 'Status', 'field': 'status', 'align': 'left'},
                    {'name': 'assets', 'label': 'Assets', 'field': 'assets', 'align': 'center'},
                    {'name': 'updated', 'label': 'Updated', 'field': 'updated', 'align': 'right'},
                    {'name': 'actions', 'label': '', 'field': 'actions', 'align': 'right'},
                ]
                rows = [
                    {'name': 'Summer Campaign 2024', 'brand': 'Acme', 'status': 'Approved', 'assets': 45, 'updated': '2 days ago'},
                    {'name': 'Black Friday Prep', 'brand': 'Global Retail', 'status': 'Draft', 'assets': 12, 'updated': '5 hours ago'},
                    {'name': 'Q3 Social Push', 'brand': 'Lifestyle Co', 'status': 'Review', 'assets': 28, 'updated': 'Just now'},
                ]
                
                table = ui.table(columns=columns, rows=rows, row_key='name').classes('w-full bg-transparent text-zinc-400')
                table.add_slot('header', r'''
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-zinc-500 font-bold uppercase text-[10px] tracking-widest h-12">
                            {{ col.label }}
                        </q-th>
                    </q-tr>
                ''')
                table.add_slot('body-cell-name', r'''
                    <q-td :props="props">
                        <div class="font-bold text-white text-sm hover:text-[#e4002b] transition-colors cursor-pointer">
                            {{ props.value }}
                        </div>
                    </q-td>
                ''')
                table.add_slot('body-cell-status', r'''
                    <q-td :props="props">
                        <q-badge :color="props.value === 'Approved' ? 'green' : props.value === 'Review' ? 'orange' : 'zinc-800'" class="text-[9px] font-black uppercase px-2">
                            {{ props.value }}
                        </q-badge>
                    </q-td>
                ''')
                table.add_slot('body-cell-actions', r'''
                    <q-td :props="props" class="text-right">
                        <q-btn flat round color="grey-6" icon="more_horiz" size="sm" />
                    </q-td>
                ''')
