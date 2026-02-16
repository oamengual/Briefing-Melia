'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerificationPage() {
    const [results, setResults] = useState<Record<string, { status: 'pending' | 'success' | 'error', message?: string }>>({
        briefs: { status: 'pending' },
        templates: { status: 'pending' },
        brands: { status: 'pending' },
        upload: { status: 'pending' }
    });

    const runTests = async () => {
        setResults({
            briefs: { status: 'pending' },
            templates: { status: 'pending' },
            brands: { status: 'pending' },
            upload: { status: 'pending' }
        });

        // Test Briefs API
        try {
            const res = await fetch('/api/briefs');
            if (res.ok) {
                const data = await res.json();
                setResults(prev => ({ ...prev, briefs: { status: 'success', message: `OK (${data.length} items)` } }));
            } else {
                throw new Error(res.statusText);
            }
        } catch (e) {
            setResults(prev => ({ ...prev, briefs: { status: 'error', message: String(e) } }));
        }

        // Test Templates API
        try {
            const res = await fetch('/api/templates');
            if (res.ok) {
                const data = await res.json();
                setResults(prev => ({ ...prev, templates: { status: 'success', message: `OK (${data.length} items)` } }));
            } else {
                throw new Error(res.statusText);
            }
        } catch (e) {
            setResults(prev => ({ ...prev, templates: { status: 'error', message: String(e) } }));
        }

        // Test Brands API
        try {
            const res = await fetch('/api/brands');
            if (res.ok) {
                const data = await res.json();
                setResults(prev => ({ ...prev, brands: { status: 'success', message: `OK (${data.length} items)` } }));
            } else {
                throw new Error(res.statusText);
            }
        } catch (e) {
            setResults(prev => ({ ...prev, brands: { status: 'error', message: String(e) } }));
        }

        // Test Upload API (Mock)
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: 'test-ping.txt', contentType: 'text/plain' })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.uploadUrl) {
                    setResults(prev => ({ ...prev, upload: { status: 'success', message: 'Signed URL generated' } }));
                } else {
                    throw new Error('No upload URL returned');
                }
            } else {
                const err = await res.json();
                throw new Error(err.error || res.statusText);
            }
        } catch (e) {
            setResults(prev => ({ ...prev, upload: { status: 'error', message: String(e) } }));
        }
    };

    return (
        <div className="container max-w-2xl py-12">
            <Card>
                <CardHeader>
                    <CardTitle>Backend Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                        Use this page to verify that your Google Cloud backend is correctly configured and reachable.
                    </p>

                    <div className="space-y-4">
                        {Object.entries(results).map(([key, result]) => (
                            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                                <span className="font-bold capitalize">{key} API</span>
                                <div className="flex items-center gap-2">
                                    {result.status === 'pending' && <span className="text-muted-foreground">Waiting...</span>}
                                    {result.status === 'success' && <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle className="w-4 h-4" /> {result.message}</span>}
                                    {result.status === 'error' && <span className="text-destructive flex items-center gap-1 font-bold"><XCircle className="w-4 h-4" /> {result.message}</span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button onClick={runTests} className="w-full">
                        Run Diagnostics
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
