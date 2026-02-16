'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
                    <h2>Something went wrong!</h2>
                    <button onClick={() => reset()} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}>Try again</button>
                </div>
            </body>
        </html>
    );
}
