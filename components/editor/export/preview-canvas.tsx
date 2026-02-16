'use client';

import * as React from 'react';
import { LayerRenderer } from '../canvas';
import { EditorState } from '@/lib/types';

interface PreviewCanvasProps {
    id: string;
    state: EditorState;
    feedData: EditorState['feedData'];
    currentRow: number;
    overriddenScale?: number;
}

export function PreviewCanvas({ id, state, feedData, currentRow, overriddenScale }: PreviewCanvasProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(overriddenScale || 0.1);

    // Dynamic Scaling Logic
    React.useLayoutEffect(() => {
        if (overriddenScale && overriddenScale > 0) {
            setScale(overriddenScale);
            // If overriddenScale is 1 (export), we don't listen to resize
            if (overriddenScale === 1) return;
            return;
        }

        const compute = () => {
            const container = containerRef.current;
            if (!container) return;
            const parent = container.parentElement;
            if (!parent) return;

            const availW = parent.clientWidth;
            const availH = parent.clientHeight;

            if (availW === 0 || availH === 0) return;

            // Fit logic: contain
            const scaleX = availW / state.width;
            const scaleY = availH / state.height;
            const fitScale = Math.min(scaleX, scaleY);

            setScale(fitScale);
        };

        const observer = new ResizeObserver(compute);
        if (containerRef.current?.parentElement) {
            observer.observe(containerRef.current.parentElement);
        }

        // Initial calc
        compute();

        return () => observer.disconnect();
    }, [state.width, state.height, overriddenScale]);

    const isExport = overriddenScale === 1;

    return (
        <div
            id={id}
            ref={containerRef}
            className={`absolute origin-center bg-card overflow-hidden ${!isExport ? 'shadow-shadow-4 border border-border' : ''}`}
            style={{
                width: state.width,
                height: state.height,
                transform: `scale(${scale})`,
            }}
        >
            {/* Transparency Checkerboard Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-10 z-0 bg-checkerboard" />

            <div className="relative z-10 w-full h-full">
                <LayerRenderer
                    layers={state.layers}
                    selectedIds={[]}
                    currentRow={currentRow}
                    feedData={feedData}
                    onSelect={() => { }}
                />
            </div>
        </div>
    );
}
