export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'content' | 'design' | 'market_manager' | 'reviewer' | 'traffic';
}
