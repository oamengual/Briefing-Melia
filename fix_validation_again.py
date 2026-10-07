import csv
import os

with open('data validation.csv', 'r') as f:
    reader = csv.reader(f)
    lines = list(reader)

with open('CSV/Hoteles.csv', 'r') as f:
    hoteles_rows = list(csv.reader(f))[1:]

with open('CSV/Destinos.csv', 'r') as f:
    destinos_rows = list(csv.reader(f))[1:]

headers = lines[0]
idx_hotel = headers.index('Hotel')
idx_abr = headers.index('Abr_Hotel')
idx_dest = headers.index('Destino')
idx_abr_dest = headers.index('Abr_Destino')

max_rows = max(len(lines) - 1, len(hoteles_rows), len(destinos_rows))

new_lines = [headers]

for i in range(max_rows):
    old_row = lines[i+1] if i+1 < len(lines) else [''] * len(headers)
    if len(old_row) < len(headers):
        old_row += [''] * (len(headers) - len(old_row))
    
    hotel_val = hoteles_rows[i][0] if i < len(hoteles_rows) else ''
    hotel_abr = hoteles_rows[i][1] if i < len(hoteles_rows) else ''
    
    destino_val = destinos_rows[i][0] if i < len(destinos_rows) else ''
    destino_abr = destinos_rows[i][1] if i < len(destinos_rows) else ''

    old_row[idx_hotel] = hotel_val
    old_row[idx_abr] = hotel_abr
    old_row[idx_dest] = destino_val
    old_row[idx_abr_dest] = destino_abr

    new_lines.append(old_row)

with open('data validation.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerows(new_lines)

