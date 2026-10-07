import csv

with open('data validation.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)
    fieldnames = reader.fieldnames

brands_to_add = [
    "Meliá Hotels International",
    "The Meliá Collection",
    "Affiliated by Meliá",
    "Falcon's Resorts",
    "MeliáRewards",
    "Meliá PRO",
    "Meliá Escapes"
]

# Find empty slots in the Brand column or extend rows
empty_slots = []
for i, r in enumerate(rows):
    if not r.get("Brand", "").strip():
        empty_slots.append(i)

for i, b in enumerate(brands_to_add):
    if i < len(empty_slots):
        rows[empty_slots[i]]["Brand"] = b
    else:
        new_row = {k: "" for k in fieldnames}
        new_row["Brand"] = b
        rows.append(new_row)

with open('data validation.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)
