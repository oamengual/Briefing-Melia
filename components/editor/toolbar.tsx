'use client';

import * as React from 'react';
import { useEditorStore } from '../../lib/editor-store';
import {
    Move, Hand, BoxSelect
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Separator unused

export function Toolbar() {
    const { activeTool, setActiveTool } = useEditorStore();

    const tools = [
        { id: 'move', icon: Move, label: 'Move (V)', shortcut: 'v' },
        { id: 'rect', icon: BoxSelect, label: 'Selection (M)', shortcut: 'm' },
        { id: 'hand', icon: Hand, label: 'Hand (H)', shortcut: 'h' },
    ];

    return (
        <div className="w-full h-full flex items-center px-2 gap-1 overflow-x-auto">
            {tools.map((tool, i) => {
                const Icon = tool.icon as any;
                const isActive = activeTool === tool.id;

                return (
                    <button
                        key={tool.id}
                        className={cn(
                            "w-8 h-8 rounded-[2px] flex items-center justify-center transition-colors",
                            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                        onClick={() => setActiveTool(tool.id as any)}
                        title={tool.label}
                    >
                        <Icon strokeWidth={1.5} className="w-4 h-4" />
                    </button>
                );
            })}
        </div>
    );
}
