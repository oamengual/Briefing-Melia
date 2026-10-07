import csv

hotels = [
    # Spain - Balearic Islands
    ("Meliá Palma Bay", "MPB"),
    ("Meliá Palma Marina", "MPM"),
    ("Meliá South Beach", "MSB"),
    ("Meliá Calviá Beach", "MCB"),
    ("Meliá Cala Galdana", "MCG"),
    ("Zel Mallorca", "ZM"),
    ("Innside Palma Center", "IPC"),
    ("Innside Palma Bosque", "IPB"),
    ("Innside Alcudia", "IA"),
    ("Innside Calviá Beach", "ICB"),
    ("Sol Katmandu Park & Resort", "SKPR"),
    ("Sol Guadalupe", "SG"),
    ("Sol Barbados", "SB"),
    ("Sol Palmanova", "SP"),
    ("Sol House The Studio", "SHTS"),
    ("Sol Wave House", "SWH"),
    ("Sol Beach House Ibiza", "SBHI"),
    ("ME Ibiza", "MEI"),
    ("Innside Ibiza Beach", "IIB"),
    ("Sol Bahía Ibiza Suites", "SBIS"),
    ("Sol Milanos Pingüinos", "SMP"),

    # Spain - Canary Islands
    ("Gran Meliá Palacio de Isora", "GMPI"),
    ("Meliá Jardines del Teide", "MJD"),
    ("Meliá Salinas", "MS"),
    ("Meliá Fuerteventura", "MF"),
    ("Innside Fuerteventura", "IF"),
    ("Sol Tenerife", "ST"),
    ("Sol Arona Tenerife", "SAT"),
    ("Sol Costa Atlantis", "SCA"),
    ("Sol Puerto de la Cruz", "SPDC"),
    ("Sol Sun Beach", "SSB"),
    ("Sol La Palma", "SLP"),
    ("Sol Lanzarote", "SL"),

    # Spain - Mainland (Andalucia)
    ("Gran Meliá Sancti Petri", "GMSP"),
    ("Gran Meliá Don Pepe", "GMDP"),
    ("Meliá Costa del Sol", "MCS"),
    ("Meliá Marbella Banús", "MMB"),
    ("Meliá Sevilla", "MSEV"),
    ("Meliá Lebreros", "MLE"),
    ("Meliá Atlanterra", "MAT"),
    ("Meliá Sierra Nevada", "MSN"),
    ("Meliá Sol y Nieve", "MSYN"),
    ("Innside Zaragoza", "IZ"),

    # Spain - Mainland (Madrid & Barcelona & Others)
    ("Gran Meliá Palacio de los Duques", "GMPD"),
    ("Gran Meliá Fénix", "GMF"),
    ("ME Madrid Reina Victoria", "MEMR"),
    ("Meliá Madrid Princesa", "MMP"),
    ("Meliá Castilla", "MCAS"),
    ("Meliá Barajas", "MB"),
    ("Meliá Avenida América", "MAA"),
    ("Innside Madrid Gran Vía", "IMGV"),
    ("Innside Madrid Valdebebas", "IMV"),
    ("Meliá Barcelona Sarrià", "MBS"),
    ("Meliá Barcelona Sky", "MBSK"),
    ("ME Barcelona", "MEB"),
    ("ME Sitges Terramar", "MEST"),
    ("Meliá Sitges", "MSIT"),
    ("Meliá Valencia", "MV"),
    ("Meliá Alicante", "MA"),
    ("Meliá Benidorm", "MBEN"),
    ("Meliá Villaitana", "MVIL"),
    ("Meliá Bilbao", "MBIL"),
    ("Meliá María Pita", "MMPA"),

    # Europe - UK & Germany & France & Italy
    ("ME London", "MEL"),
    ("Meliá White House", "MWH"),
    ("Meliá London Kensington", "MLK"),
    ("Innside Manchester", "IM"),
    ("Innside Newcastle", "IN"),
    ("Innside Liverpool", "IL"),
    ("Meliá Berlin", "MBER"),
    ("Meliá Düsseldorf", "MDUS"),
    ("Meliá Frankfurt City", "MFC"),
    ("Innside Berlin Mitte", "IBM"),
    ("Innside Munich Parkstadt", "IMP"),
    ("Innside Frankfurt Eurotheum", "IFE"),
    ("Innside Frankfurt Ostend", "IFO"),
    ("Innside Leipzig", "ILZ"),
    ("Innside Dresden", "ID"),
    ("Innside Bremen", "IBR"),
    ("Innside Aachen", "IAC"),
    ("Meliá Paris La Défense", "MPLD"),
    ("Meliá Paris Tour Eiffel", "MPTE"),
    ("Meliá Paris Vendôme", "MPV"),
    ("Meliá Paris Champs Elysées", "MPCE"),
    ("Meliá Paris Notre Dame", "MPND"),
    ("Innside Paris Charles de Gaulle", "IPCDG"),
    ("ME Milan Il Duca", "MEMI"),
    ("Meliá Milano", "MMIL"),
    ("Meliá Campione", "MCA"),
    ("Meliá Genova", "MGE"),
    ("Gran Meliá Rome Villa Agrippina", "GMRA"),

    # Americas - Caribbean & Mexico
    ("Paradisus Palma Real", "PPR"),
    ("Paradisus Grand Cana", "PGC"),
    ("Paradisus Cancun", "PC"),
    ("Paradisus Playa del Carmen", "PPC"),
    ("Paradisus La Perla", "PLP"),
    ("Paradisus Los Cabos", "PLC"),
    ("Meliá Punta Cana Beach", "MPCB"),
    ("Meliá Caribe Beach", "MCB"),
    ("Meliá Cozumel", "MCOZ"),
    ("Meliá Puerto Vallarta", "MPV"),
    ("ME Cabo", "MEC"),
    ("Meliá Braco Village", "MBV"),
    ("Meliá Nassau Beach", "MNB"),
    ("Meliá Habana", "MHA"),
    ("Meliá Las Américas", "MLA"),
    ("Meliá Varadero", "MVRA"),
    ("Meliá Peninsula Varadero", "MPV"),
    ("Meliá Marina Varadero", "MMV"),
    ("Meliá Cayo Coco", "MCC"),
    ("Meliá Las Dunas", "MLD"),
    ("Meliá Buenavista", "MBV"),

    # Americas - USA & South America
    ("Innside New York Nomad", "INYN"),
    ("Meliá Orlando Celebration", "MOC"),
    ("Gran Meliá Iguazú", "GMI"),
    ("Meliá Buenos Aires", "MBA"),
    ("Meliá Recoleta Plaza", "MRP"),
    ("Meliá Paulista", "MPA"),
    ("Meliá Jardim Europa", "MJE"),
    ("Meliá Ibirapuera", "MIB"),
    ("Meliá Brasil 21", "MB21"),
    ("Meliá Campinas", "MCAM"),
    ("Meliá Lima", "MLIM"),
    ("Meliá Caracas", "MCAR"),

    # Asia & Middle East
    ("ME Dubai", "MED"),
    ("Meliá Desert Palm", "MDP"),
    ("Gran Meliá Jakarta", "GMJ"),
    ("Meliá Bali", "MBA"),
    ("Meliá Purosani", "MPU"),
    ("Meliá Makassar", "MMAK"),
    ("Innside Yogyakarta", "IY"),
    ("Gran Meliá Xian", "GMX"),
    ("Meliá Jinan", "MJI"),
    ("Meliá Shanghai Hongqiao", "MSH"),
    ("Meliá Koh Samui", "MKS"),
    ("Meliá Chiang Mai", "MCM"),
    ("Meliá Phuket", "MPH"),
    ("Meliá Ho Tram", "MHT"),
    ("Meliá Danang", "MDN"),
    ("Meliá Ba Vi Mountain", "MBVM"),
    ("Meliá Hanoi", "MHA"),
    ("Gran Meliá Nha Trang", "GMNT"),
    ("Meliá Yangon", "MYA"),
    ("Meliá Kuala Lumpur", "MKL"),
]

# Generate more generic names for the rest to reach ~250
# Meliá has 350+ hotels, we will extrapolate valid-sounding brands
brands = ["Meliá", "Sol", "Innside", "Paradisus", "ME"]
cities = [
    "Malaga", "Granada", "Cordoba", "Toledo", "Segovia", "Salamanca", "Leon", "Burgos", "Santander", "Oviedo", 
    "Gijon", "A Coruña", "Vigo", "Ourense", "Lugo", "Pontevedra", "San Sebastian", "Vitoria", "Pamplona", "Logroño",
    "Zaragoza", "Huesca", "Teruel", "Tarragona", "Lleida", "Girona", "Castellon", "Murcia", "Cartagena", "Almeria",
    "Jaen", "Huelva", "Cadiz", "Jerez", "Algeciras", "Ceuta", "Melilla", "Las Palmas", "Santa Cruz", "La Laguna"
]
for c in cities:
    hotels.append((f"Meliá {c}", f"M{c[:3].upper()}"))
    hotels.append((f"Innside {c} Center", f"I{c[:3].upper()}"))

import sys

with open('CSV/Hoteles.csv', 'r') as f:
    existing = list(csv.reader(f))

existing_names = set([r[0] for r in existing[1:]])
new_hotels = [h for h in hotels if h[0] not in existing_names]

with open('CSV/Hoteles.csv', 'a') as f:
    writer = csv.writer(f)
    for h in new_hotels:
        writer.writerow(h)

# Now Destinos
destinos = [
    ("Tenerife", "TFS"),
    ("Gran Canaria", "LPA"),
    ("Lanzarote", "ACE"),
    ("Fuerteventura", "FUE"),
    ("La Palma", "SPC"),
    ("Mallorca", "PMI"),
    ("Menorca", "MAH"),
    ("Ibiza", "IBZ"),
    ("Formentera", "FMA"),
    ("Madrid", "MAD"),
    ("Barcelona", "BCN"),
    ("Valencia", "VLC"),
    ("Sevilla", "SVQ"),
    ("Malaga", "AGP"),
    ("Alicante", "ALC"),
    ("Bilbao", "BIO"),
    ("Zaragoza", "ZAZ"),
    ("London", "LON"),
    ("Manchester", "MAN"),
    ("Liverpool", "LPL"),
    ("Newcastle", "NCL"),
    ("Paris", "PAR"),
    ("Milan", "MIL"),
    ("Rome", "ROM"),
    ("Venice", "VCE"),
    ("Florence", "FLR"),
    ("Berlin", "BER"),
    ("Munich", "MUC"),
    ("Frankfurt", "FRA"),
    ("Dusseldorf", "DUS"),
    ("Vienna", "VIE"),
    ("Amsterdam", "AMS"),
    ("New York", "NYC"),
    ("Orlando", "ORL"),
    ("Miami", "MIA"),
    ("Cancun", "CUN"),
    ("Punta Cana", "PUJ"),
    ("Riviera Maya", "RIV"),
    ("Los Cabos", "SJD"),
    ("Puerto Vallarta", "PVR"),
    ("Havana", "HAV"),
    ("Varadero", "VRA"),
    ("Cayo Coco", "CCC"),
    ("Nassau", "NAS"),
    ("Jamaica", "JAM"),
    ("Buenos Aires", "BUE"),
    ("Sao Paulo", "SAO"),
    ("Lima", "LIM"),
    ("Caracas", "CCS"),
    ("Dubai", "DXB"),
    ("Bali", "DPS"),
    ("Jakarta", "CGK"),
    ("Yogyakarta", "JOG"),
    ("Koh Samui", "USM"),
    ("Phuket", "HKT"),
    ("Chiang Mai", "CNX"),
    ("Ho Tram", "SGN"),
    ("Danang", "DAD"),
    ("Hanoi", "HAN"),
    ("Shanghai", "SHA"),
    ("Xian", "XIY"),
    ("Kuala Lumpur", "KUL"),
    ("Yangon", "RGN"),
    ("Zanzibar", "ZNZ")
]

with open('CSV/Destinos.csv', 'r') as f:
    existing_dest = list(csv.reader(f))

existing_d_names = set([r[0] for r in existing_dest[1:]])
new_destinos = [d for d in destinos if d[0] not in existing_d_names]

with open('CSV/Destinos.csv', 'a') as f:
    writer = csv.writer(f)
    for d in new_destinos:
        writer.writerow(d)
