export type Dictionary = typeof en;

export const en = {
    nav: {
        overview: 'Overview',
        briefings: 'Briefings',
        reports: 'Reports',
        templates: 'Templates',
        archive: 'Archive',
        settings: 'Settings'
    },
    common: {
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        next: 'Next',
        add: 'Add',
        actions: 'Actions',
        status: 'Status',
        search: 'Search...',
        none: 'None'
    },
    settings: {
        title: 'Application Settings',
        general: 'General Preferences',
        geminiKey: 'Gemini API Key',
        generalDesc: 'Configure global application behavior.',
        language: 'Application Language',
        workspace: 'Workspace Name',
        users: 'User Management',
        usersDesc: 'Manage users who can be assigned to briefs.',
        userName: 'Name',
        userEmail: 'Email',
        userRole: 'Role',
        addUser: 'Add User',
        saveChanges: 'Save Changes',
        saved: 'Settings Saved'
    },
    reports: {
        title: 'Campaign Reports',
        subtitle: 'Asset volume, market coverage, and timeline analysis.',
        campaign: 'Campaign / Key Visual',
        petitioner: 'Petitioner',
        timeline: 'Timeline',
        markets: 'Markets',
        assets: 'Assets',
        status: 'Status',
        noCampaigns: 'No campaigns found.',
        activeMarkets: 'All Active Markets',
        copyStrategy: 'Copy & Strategy',
        technical: 'Technical Specs',
        mainClaim: 'Main Claim',
        discount: 'Discount',
        cta: 'CTA',
        keyVisual: 'Key Visual File',
        duration: 'Duration',
        days: 'Days'
    },
    campaign: {
        title: 'Campaign Details',
        general: 'General Information',
        name: 'Campaign Name',
        brand: 'Brand',
        agency: 'Agency / Petitioner',
        year: 'Year',
        month: 'Month',
        owner: 'Assigned To',
        masterLang: 'Master Language',
        targeting: 'Targeting',
        audience: 'Target Audience',
        regions: 'Regions',
        strategy: 'Strategy',
        marketingObjective: 'Marketing Objective',
        kpi: 'Key Performance Indicator (KPI)',
        projectStrategy: 'Project Strategy',
        digital: 'Digital Assets',
        landingPage: 'Landing Page URL'
    },
    tabs: {
        details: 'Campaign Details',
        matrix: 'Market Matrix',
        content: 'Creative Content',
        translations: 'Translations',
        feed: 'Export / Feed'
    },
    translations: {
        title: 'Localization',
        subtitle: 'Translate creative copy for your active markets.',
        autoTranslate: 'Auto-Translate Existing',
        tip: 'Tip',
        tipText: 'Empty fields will automatically fall back to the Master version content.',
        master: 'Master',
        translateTo: 'Translate to'
    }
};

export const es: Dictionary = {
    nav: {
        overview: 'Resumen',
        briefings: 'Briefings',
        reports: 'Reportes',
        templates: 'Plantillas',
        archive: 'Archivo',
        settings: 'Ajustes'
    },
    common: {
        save: 'Guardar',
        saving: 'Guardando...',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        back: 'Atrás',
        next: 'Siguiente',
        add: 'Añadir',
        actions: 'Acciones',
        status: 'Estado',
        search: 'Buscar...',
        none: 'Ninguno'
    },
    settings: {
        title: 'Ajustes de la Aplicación',
        general: 'Preferencias Generales',
        geminiKey: 'Clave API de Gemini',
        generalDesc: 'Configura el comportamiento global de la aplicación.',
        language: 'Idioma de la Aplicación',
        workspace: 'Nombre del Workspace',
        users: 'Gestión de Usuarios',
        usersDesc: 'Gestiona los usuarios que pueden ser asignados a los briefings.',
        userName: 'Nombre',
        userEmail: 'Email',
        userRole: 'Rol',
        addUser: 'Añadir Usuario',
        saveChanges: 'Guardar Cambios',
        saved: 'Ajustes Guardados'
    },
    reports: {
        title: 'Reportes de Campaña',
        subtitle: 'Volumen de assets, cobertura de mercado y análisis temporal.',
        campaign: 'Campaña / Visual',
        petitioner: 'Peticionario',
        timeline: 'Cronograma',
        markets: 'Mercados',
        assets: 'Assets',
        status: 'Estado',
        noCampaigns: 'No se encontraron campañas.',
        activeMarkets: 'Todos los Mercados Activos',
        copyStrategy: 'Copy y Estrategia',
        technical: 'Especificaciones Técnicas',
        mainClaim: 'Reclamo Principal',
        discount: 'Descuento',
        cta: 'CTA',
        keyVisual: 'Archivo Visual Clave',
        duration: 'Duración',
        days: 'Días'
    },
    campaign: {
        title: 'Detalles de Campaña',
        general: 'Información General',
        name: 'Nombre de Campaña',
        brand: 'Marca',
        agency: 'Agencia / Peticionario',
        year: 'Año',
        month: 'Mes',
        owner: 'Asignado A',
        masterLang: 'Idioma Maestro',
        targeting: 'Segmentación',
        audience: 'Audiencia Objetivo',
        regions: 'Regiones',
        strategy: 'Estrategia',
        marketingObjective: 'Objetivo de Marketing',
        kpi: 'Indicador Clave (KPI)',
        projectStrategy: 'Estrategia del Proyecto',
        digital: 'Activos Digitales',
        landingPage: 'URL Landing Page'
    },
    tabs: {
        details: 'Detalles de Campaña',
        matrix: 'Matriz de Mercados',
        content: 'Contenido Creativo',
        translations: 'Traducciones',
        feed: 'Exportar / Feed'
    },
    translations: {
        title: 'Localización',
        subtitle: 'Traduce los textos creativos para tus mercados activos.',
        autoTranslate: 'Auto-Traducir Existentes',
        tip: 'Consejo',
        tipText: 'Los campos vacíos usarán automáticamente el contenido de la versión Maestra.',
        master: 'Maestro',
        translateTo: 'Traducir a'
    }
};

export const dictionaries = { en, es };
