export interface ActivityLog {
    id: string;
    briefId: string;
    userId: string;
    userName: string;
    action: 'created' | 'updated' | 'duplicated' | 'deleted';
    timestamp: number;
    details?: string;
    changes?: { field: string; oldValue: unknown; newValue: unknown }[];
}
