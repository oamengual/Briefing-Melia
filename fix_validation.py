import csv
import os

with open('data validation.csv', 'r') as f:
    reader = csv.reader(f)
    lines = list(reader)

headers = lines[0]
print("Old headers:", headers)

# Find where Hotel/Destino is
idx = headers.index('Hotel/Destino/Categorización')

# We'll build new rows.
# But wait, we want the exhaustive list of hotels and destinos to be in the columns.
# It's better if we just inject the columns and then overwrite the file.
new_headers = headers[:idx] + ['Hotel', 'Abr_Hotel', 'Destino', 'Abr_Destino'] + headers[idx+3:]

new_lines = []
new_lines.append(new_headers)

# Let's read Hoteles.csv and Destinos.csv
with open('CSV/Hoteles.csv', 'r') as f:
    hoteles_rows = list(csv.reader(f))[1:]

with open('CSV/Destinos.csv', 'r') as f:
    destinos_rows = list(csv.reader(f))[1:]

max_rows = max(len(lines) - 1, len(hoteles_rows), len(destinos_rows))

for i in range(max_rows):
    # original row logic
    old_row = lines[i+1] if i+1 < len(lines) else [''] * len(headers)
    if len(old_row) < len(headers):
        old_row += [''] * (len(headers) - len(old_row))
    
    # get hotel
    hotel_val = hoteles_rows[i][0] if i < len(hoteles_rows) else ''
    hotel_abr = hoteles_rows[i][1] if i < len(hoteles_rows) else ''
    
    # get destino
    destino_val = destinos_rows[i][0] if i < len(destinos_rows) else ''
    destino_abr = destinos_rows[i][1] if i < len(destinos_rows) else ''

    new_row = old_row[:idx] + [hotel_val, hotel_abr, destino_val, destino_abr] + old_row[idx+3:]
    new_lines.append(new_row)

with open('data validation.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerows(new_lines)

print("Fixed data validation.csv")
