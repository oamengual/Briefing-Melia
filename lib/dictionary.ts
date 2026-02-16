export const MARKETING_DICTIONARY: Record<string, Record<string, string>> = {
    'es': {
        'Up to': 'Hasta',
        'Shop Now': 'Compra Ahora',
        'Book Now': 'Reserva Ahora',
        'Discover': 'Descubre',
        'Sale': 'Rebajas',
        'New Collection': 'Nueva Colección',
        'Limited Time': 'Tiempo Limitado',
        '% Off': '% de Descuento'
    },
    'fr': {
        'Up to': 'Jusqu\'à',
        'Shop Now': 'Acheter Maintenant',
        'Book Now': 'Réserver',
        'Discover': 'Découvrir',
        'Sale': 'Soldes',
        'New Collection': 'Nouvelle Collection',
        'Limited Time': 'Temps Limité',
        '% Off': '% de Réduction'
    },
    'de': {
        'Up to': 'Bis zu',
        'Shop Now': 'Jetzt Kaufen',
        'Book Now': 'Jetzt Buchen',
        'Discover': 'Entdecken',
        'Sale': 'Verkauf',
        'New Collection': 'Neue Kollektion',
        'Limited Time': 'Begrenzte Zeit',
        '% Off': '% Rabatt'
    },
    'it': {
        'Up to': 'Fino a',
        'Shop Now': 'Acquista Ora',
        'Book Now': 'Prenota Ora',
        'Discover': 'Scopri',
        'Sale': 'Saldi',
        'New Collection': 'Nuova Collezione',
        'Limited Time': 'Tempo Limitato',
        '% Off': '% di Sconto'
    },
    'pt': {
        'Up to': 'Até',
        'Shop Now': 'Compre Agora',
        'Book Now': 'Reserve Agora',
        'Discover': 'Descobrir',
        'Sale': 'Saldos',
        'New Collection': 'Nova Coleção',
        'Limited Time': 'Tempo Limitado',
        '% Off': '% de Desconto'
    }
};

export function suggestTranslation(text: string, lang: string): string {
    const dict = MARKETING_DICTIONARY[lang];
    if (!dict) return text; // No dictionary for this language

    // 1. Direct match
    if (dict[text]) return dict[text];

    // 2. Case insensitive match
    const lowerText = text.toLowerCase();
    const entry = Object.entries(dict).find(([k]) => k.toLowerCase() === lowerText);
    if (entry) return entry[1];

    // 3. Partial match (simple substitution)
    // E.g. "Up to 50% Off" -> "Hasta 50% de Descuento"
    let translated = text;
    let modified = false;
    Object.entries(dict).forEach(([key, value]) => {
        if (translated.toLowerCase().includes(key.toLowerCase())) {
            // Regex to replace keeping case? Too complex for now, just simple replace
            const regex = new RegExp(key, 'gi');
            translated = translated.replace(regex, value);
            modified = true;
        }
    });

    return modified ? translated : '';
}
