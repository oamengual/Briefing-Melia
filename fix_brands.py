import csv

with open('data validation.csv', 'r') as f:
    reader = csv.reader(f)
    rows = list(reader)

brands = [
    ('Gran Meliá', 'gm'),
    ('Paradisus', 'pa'),
    ('ME by Meliá', 'me'),
    ('Meliá Hotels & Resorts', 'ml'),
    ('INNSiDE by Meliá', 'in'),
    ('Sol by Meliá', 'sol'),
    ('ZEL', 'zel')
]

for i, row in enumerate(rows):
    if i == 0:
        continue
    if i <= len(brands):
        row[7] = brands[i-1][0]
    else:
        row[7] = ''

with open('data validation.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)
