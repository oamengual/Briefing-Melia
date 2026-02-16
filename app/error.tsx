'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 shadow-shadow-2 border border-destructive/20">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong</h2>
                <p className="text-muted-foreground max-w-[500px] text-sm leading-relaxed">
                    {error.message || "An unexpected error occurred while processing your request. Please try again or contact support if the issue persists."}
                </p>
                {error.stack && (
                    <div className="mt-4 p-4 rounded-md bg-secondary-container/50 border border-border text-left overflow-auto max-w-[600px] max-h-[200px] shadow-inner group">
                        <pre className="text-[10px] font-mono text-muted-foreground/80 leading-normal scrollbar-hide">
                            {error.stack}
                        </pre>
                    </div>
                )}
            </div>
            <div className="flex gap-3 mt-4">
                <Button
                    onClick={() => reset()}
                    variant="default"
                    className="h-11 px-6 shadow-shadow-2 hover:shadow-shadow-4 transition-all"
                >
                    Try again
                </Button>
                <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="h-11 px-6"
                >
                    Go Home
                </Button>
            </div>
        </div>
    );
}
