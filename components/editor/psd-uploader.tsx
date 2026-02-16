'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { EditorState } from '@/lib/types';
import { parsePsd } from '../../lib/psd-utils';

interface PsdUploaderProps {
    onLoad: (data: { state: EditorState; preview?: string; file: File }) => void;
}

export function PsdUploader({ onLoad }: PsdUploaderProps) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError('');

        try {
            const { state, preview } = await parsePsd(file);
            // We know our utility returns a compatible state structure
            onLoad({ state: state as EditorState, preview, file });
        } catch (err) {
            console.error(err);
            setError('Failed to import PSD. Please check the file format.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-center hover:bg-accent/50 transition-colors group cursor-pointer relative overflow-hidden bg-card border-border text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            </div>

            <div className="space-y-2 z-10">
                <h3 className="font-semibold text-xl text-foreground">Open PSD</h3>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                    Drag & drop or click to open.
                </p>
                {error && (
                    <div className="text-xs text-destructive flex items-center justify-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </div>
                )}
            </div>

            <input
                type="file"
                accept=".psd"
                disabled={loading}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
        </Card>
    );
}
