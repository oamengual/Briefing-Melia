import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from './types';

interface UserState {
    currentUser: User;
    users: User[];
    switchUser: (userId: string) => void;
}

export const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@studio.com',
        role: 'admin'
    },
    {
        id: '2',
        name: 'Emma Editor',
        email: 'editor@studio.com',
        role: 'editor'
    },
    {
        id: '3',
        name: 'Charlie Content',
        email: 'writer@studio.com',
        role: 'content'
    },
    {
        id: '4',
        name: 'Diana Design',
        email: 'design@studio.com',
        role: 'design'
    },
    {
        id: '5',
        name: 'Mike Market',
        email: 'markets@studio.com',
        role: 'market_manager'
    },
    {
        id: '6',
        name: 'Tom Traffic',
        email: 'traffic@studio.com',
        role: 'traffic'
    },
    {
        id: '7',
        name: 'Rachel Review',
        email: 'viewer@studio.com',
        role: 'reviewer'
    }
];

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            users: MOCK_USERS,
            currentUser: MOCK_USERS[0], // Default to Admin
            switchUser: (userId) => set((state) => ({
                currentUser: state.users.find((u) => u.id === userId) || state.currentUser
            })),
        }),
        {
            name: 'briefing_station_user_session',
        }
    )
);
