'use client';

import * as React from 'react';
import { BriefingBuilder } from '@/components/briefing-builder';
import { useParams, useRouter } from 'next/navigation';
import { useBriefingStore } from '@/lib/store';
import { getBrief } from '@/lib/storage';
import { Loader2 } from 'lucide-react';

export default function BriefingPage() {
    const params = useParams();
    const router = useRouter();
    const { loadBrief, reset } = useBriefingStore();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const load = async () => {
            const id = params.id as string;
            if (id === 'new') {
                reset();
                setLoading(false);
                return;
            }

            const brief = await getBrief(id);
            if (brief) {
                loadBrief({
                    inputs: brief.state.inputs,
                    creative: brief.state.creative,
                    translations: brief.state.translations,
                    matrix: brief.state.matrix,
                    lockedFields: brief.state.lockedFields,
                    namingConvention: brief.state.namingConvention,
                    psdTemplateId: brief.state.psdTemplateId,
                    psdTemplates: brief.state.psdTemplates
                });
                setLoading(false);
            } else {
                // Brief not found
                // router.push('/'); // Or show 404
                alert('Brief not found');
                router.push('/');
            }
        };
        load();
    }, [params.id, loadBrief, reset, router]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <BriefingBuilder briefId={params.id === 'new' ? undefined : (params.id as string)} />;
}
