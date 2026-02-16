'use client';

import * as React from 'react';

import { FileImage } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBriefingStore } from '@/lib/store';
import { TemplatePanel } from '@/components/editor/template-panel';
import { saveTemplateState, saveTemplatePreview } from '@/lib/psd-storage';

export function PsdManager({ briefId }: { briefId?: string }) {
    const {
        psdTemplates,
        addPsdTemplate,
        removePsdTemplate,
        setPsdTemplateId,
        psdTemplateId
    } = useBriefingStore();

    if (briefId === 'new') {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="p-10 pb-4">
                    <CardTitle className="tracking-tight text-2xl font-bold text-foreground">Design Templates</CardTitle>
                    <CardDescription className="text-sm font-medium text-muted-foreground">Associate Photoshop (PSD) files with this campaign.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border radius-card bg-muted/30 text-muted-foreground shadow-none">
                        <FileImage className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm font-bold">Please save the campaign first to upload templates.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (

        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="p-0 pb-6">
                <CardTitle className="tracking-tight text-2xl font-bold text-foreground">Design Templates</CardTitle>
                <CardDescription className="text-sm font-medium text-muted-foreground">Manage the Photoshop masters linked to this campaign. Switch between them to generate assets.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full">
                    <TemplatePanel
                        templates={psdTemplates || []}
                        activeId={psdTemplateId}
                        matrix={useBriefingStore.getState().matrix} // Pass matrix for validation
                        onAdd={async (tpl) => {
                            addPsdTemplate(tpl);

                            // Persist heavy state to IDB immediately
                            if (tpl.editorState) {
                                await saveTemplateState(tpl.id, tpl.editorState);
                            }
                            if (tpl.preview) {
                                await saveTemplatePreview(tpl.id, tpl.preview);
                            }

                            setPsdTemplateId(tpl.id); // Auto-select new
                        }}
                        onRemove={(id) => {
                            removePsdTemplate(id);
                            if (psdTemplateId === id) setPsdTemplateId(undefined);
                        }}
                        onSelect={(id) => setPsdTemplateId(id)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
