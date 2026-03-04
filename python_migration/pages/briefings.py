from datetime import datetime
from nicegui import ui
from components.layout import layout_wrapper
from logic.briefing_manager import BriefingManager
from theme import THEME

@ui.page('/briefings')
def briefings_page():
    # State for filtering
    filter_state = {
        'search': '',
        'status': 'all',
        'sort': 'updated'
    }

    def update_table():
        briefs = BriefingManager.list_briefs()
        
        # Apply Search
        if filter_state['search']:
            s = filter_state['search'].lower()
            briefs = [b for b in briefs if s in b['name'].lower() or s in b['brand'].lower()]
        
        # Apply Status Filter
        if filter_state['status'] != 'all':
            if filter_state['status'] == 'active':
                briefs = [b for b in briefs if b['status'] in ['review', 'approved']]
            else:
                briefs = [b for b in briefs if b['status'] == filter_state['status']]
        
        # Apply Sort
        if filter_state['sort'] == 'name':
            briefs.sort(key=lambda x: x['name'])
        elif filter_state['sort'] == 'assets':
            briefs.sort(key=lambda x: x['asset_count'], reverse=True)
        # manager already sorts by updated_at desc
        
        table.rows[:] = briefs
        table.update()
        
        # Update Stats Cards
        stats = BriefingManager.get_stats()
        stats_cards[0].set_text(str(stats['total']))
        stats_cards[1].set_text(str(stats['drafts']))
        stats_cards[2].set_text(str(stats['active']))
        stats_cards[3].set_text(str(stats['completed']))

    def handle_delete(brief_id: str):
        BriefingManager.delete_brief(brief_id)
        ui.notify('Campaign deleted', type='negative')
        update_table()

    def handle_duplicate(brief_id: str):
        new_id = BriefingManager.duplicate_brief(brief_id)
        if new_id:
            ui.notify('Campaign duplicated', type='positive')
            update_table()

    with layout_wrapper():
        # Header Section
        with ui.row().classes('w-full items-center justify-between p-8 border-b border-slate-200 bg-white'):
            with ui.column().classes('gap-1'):
                ui.label('Campaign Briefings').classes('text-3xl font-bold tracking-tight text-slate-900')
                ui.label('Access and manage all your active and archived content campaigns.').classes('text-base text-slate-500')
            
            with ui.row().classes('gap-4'):
                ui.button('New Campaign', icon='add', on_click=lambda: ui.open('/briefing-new')).classes(f'bg-[{THEME["primary"]}] rounded-lg px-6 font-bold shadow-lg h-11')

        # Content Area
        with ui.column().classes('w-full max-w-6xl mx-auto p-8 gap-10'):
            # Stats (Mini Cards)
            stats = BriefingManager.get_stats()
            stats_cards = []
            with ui.grid(columns=4).classes('w-full gap-4'):
                for label, value, color in [
                    ('All Briefs', str(stats['total']), 'slate-900'),
                    ('Drafts', str(stats['drafts']), 'slate-500'),
                    ('Active', str(stats['active']), 'blue-600'),
                    ('Completed', str(stats['completed']), 'teal-600'),
                ]:
                    with ui.card().classes('bg-white border border-slate-200 p-4 gap-0 shadow-sm rounded-xl'):
                        ui.label(label).classes('text-[10px] font-black uppercase tracking-widest text-slate-500')
                        stats_cards.append(ui.label(value).classes(f'text-2xl font-bold text-{color}'))

            # Filters & Search
            with ui.row().classes('w-full justify-between items-center border-b border-slate-200 pb-6'):
                with ui.tabs(on_change=lambda e: (filter_state.update({'status': e.value.lower()}), update_table())).classes('bg-transparent text-slate-500') as tabs:
                    ui.tab('All')
                    ui.tab('Drafts')
                    ui.tab('Active')
                    ui.tab('Completed')
                
                with ui.row().classes('items-center gap-3'):
                    with ui.row().classes('relative items-center'):
                        ui.icon('search').classes('absolute left-3 text-slate-400 z-10')
                        ui.input(placeholder='Search campaigns', on_change=lambda e: (filter_state.update({'search': e.value}), update_table())).classes('bg-white border-slate-200 rounded-lg h-10 pl-10 w-64 text-sm').props('outlined dense')
                    
                    ui.select({
                        'updated': 'Last Updated',
                        'name': 'Name (A-Z)',
                        'assets': 'Asset Count'
                    }, value='updated', on_change=lambda e: (filter_state.update({'sort': e.value}), update_table())).classes('bg-white border-slate-200 rounded-lg h-10 w-40 text-sm')

            # Briefings Table
            with ui.card().classes('w-full bg-white border border-slate-200 p-0 rounded-xl shadow-sm overflow-hidden'):
                columns = [
                    {'name': 'name', 'label': 'Campaign Name', 'field': 'name', 'required': True, 'align': 'left'},
                    {'name': 'brand', 'label': 'Brand', 'field': 'brand', 'align': 'left'},
                    {'name': 'status', 'label': 'Status', 'field': 'status', 'align': 'left'},
                    {'name': 'assets', 'label': 'Assets', 'field': 'asset_count', 'align': 'center'},
                    {'name': 'updated', 'label': 'Updated', 'field': 'updated_at', 'align': 'right'},
                    {'name': 'actions', 'label': '', 'field': 'id', 'align': 'right'},
                ]
                
                table = ui.table(columns=columns, rows=BriefingManager.list_briefs(), row_key='id').classes('w-full bg-transparent text-slate-600 font-medium')
                
                # Table Slots for Parity
                table.add_slot('header', r'''
                    <q-tr :props="props">
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-slate-400 font-bold uppercase text-[10px] tracking-widest h-12">
                            {{ col.label }}
                        </q-th>
                    </q-tr>
                ''')
                
                table.add_slot('body-cell-name', r'''
                    <q-td :props="props">
                        <div class="font-bold text-slate-900 text-sm hover:text-[#e4002b] transition-colors cursor-pointer" @click="$parent.$emit('open', props.row.id)">
                            {{ props.value }}
                        </div>
                    </q-td>
                ''')
                
                table.add_slot('body-cell-status', r'''
                    <q-td :props="props">
                        <q-badge :color="props.value === 'approved' ? 'green-1' : props.value === 'review' ? 'orange-1' : 'slate-100'" 
                                 :text-color="props.value === 'approved' ? 'green-7' : props.value === 'review' ? 'orange-7' : 'slate-500'"
                                 class="text-[9px] font-black uppercase px-2">
                            {{ props.value }}
                        </q-badge>
                    </q-td>
                ''')
                
                table.add_slot('body-cell-brand', r'''
                    <q-td :props="props">
                        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {{ props.value }}
                        </div>
                    </q-td>
                ''')

                table.add_slot('body-cell-updated', r'''
                    <q-td :props="props" class="text-right text-xs text-slate-400">
                        {{ new Date(props.value * 1000).toLocaleDateString() }}
                    </q-td>
                ''')
                
                table.add_slot('body-cell-actions', r'''
                    <q-td :props="props" class="text-right">
                        <q-btn flat round dense color="grey-6" icon="content_copy" size="sm" @click="$parent.$emit('duplicate', props.value)" />
                        <q-btn flat round dense color="grey-6" icon="delete" size="sm" @click="$parent.$emit('delete', props.value)" />
                    </q-td>
                ''')

                table.on('open', lambda e: ui.open(f'/briefing/{e.args}'))
                table.on('duplicate', lambda e: handle_duplicate(e.args))
                table.on('delete', lambda e: handle_delete(e.args))
