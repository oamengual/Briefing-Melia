import csv
import os

def read_csv(path):
    with open(path, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        return list(reader)

def write_csv(path, rows):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

dv_rows = read_csv('data validation.csv')
usps_rows = read_csv('usps.csv')
placements_rows = read_csv('CSV/placements.csv')

# Max rows
max_len = max(len(dv_rows), len(usps_rows), len(placements_rows))

merged_rows = []
for i in range(max_len):
    row = []
    
    # Data Validation original columns (23 columns)
    dv = dv_rows[i] if i < len(dv_rows) else [''] * 23
    row.extend(dv + [''] * (23 - len(dv)))
    
    # USPs (9 columns)
    if i == 0:
        usps = ['USP_ID', 'USP_es-es', 'USP_en-us', 'USP_de-de', 'USP_fr-fr', 'USP_nl-nl', 'USP_it-it', 'USP_pt-pt', 'USP_pl-pl']
    else:
        usps = usps_rows[i] if i < len(usps_rows) else [''] * 9
    row.extend(usps + [''] * (9 - len(usps)))
    
    # Placements (7 columns)
    if i == 0:
        pl = ['Placement_Channel', 'Placement_Name', 'Placement_Size', 'Placement_Width', 'Placement_Height', 'Placement_Weight', 'Placement_Type']
    else:
        pl = placements_rows[i] if i < len(placements_rows) else [''] * 7
    row.extend(pl + [''] * (7 - len(pl)))
    
    merged_rows.append(row)

write_csv('data validation merged.csv', merged_rows)
