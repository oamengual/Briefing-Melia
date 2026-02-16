'use client';

import * as React from 'react';
import { useEditorStore } from '@/lib/editor-store';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; 
// Use simple divs instead to avoid dependency issues.
import { Upload, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Papa from 'papaparse';

export function FeedPanel() {
    const { feedData, setFeedData, currentFeedRow, setCurrentRow } = useEditorStore();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    const headers = results.meta.fields || Object.keys(results.data[0] as any);
                    setFeedData({
                        headers,
                        rows: results.data as Record<string, string>[],
                    });
                }
            },
            error: (err) => {
                console.error('CSV Parse Error', err);
                alert('Failed to parse CSV');
            }
        });
    };

    if (!feedData) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                <div className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-sidebar-accent/50 transition-colors relative cursor-pointer group">
                    <div className="mb-2 group-hover:text-foreground transition-colors">
                        <Upload className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <span className="text-xs">Import CSV Data</span>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                    />
                </div>
                <p className="text-[10px] mt-2 opacity-50">.csv files with headers</p>
            </div>
        );
    }

    const currentRowData = feedData.rows[currentFeedRow];
    const totalRows = feedData.rows.length;

    return (
        <div className="flex flex-col h-full text-foreground/80">
            {/* Controls */}
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-foreground">Row</span>
                    <div className="flex items-center bg-sidebar-accent/50 rounded-sm border border-sidebar-border">
                        <button
                            className="p-1 hover:text-foreground disabled:opacity-30"
                            disabled={currentFeedRow === 0}
                            onClick={() => setCurrentRow(currentFeedRow - 1)}
                        >
                            <ChevronLeft className="w-3 h-3" />
                        </button>
                        <span className="w-12 text-center font-mono text-[10px]">{currentFeedRow + 1} / {totalRows}</span>
                        <button
                            className="p-1 hover:text-foreground disabled:opacity-30"
                            disabled={currentFeedRow === totalRows - 1}
                            onClick={() => setCurrentRow(currentFeedRow + 1)}
                        >
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
                <button className="text-destructive hover:text-destructive/80" onClick={() => setFeedData(undefined)} title="Remove Data">
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>

            {/* Data Grid */}
            <div className="flex-1 overflow-auto bg-card border border-border rounded-sm p-2">
                {currentRowData ? (
                    <div className="space-y-2">
                        {feedData.headers.map(header => (
                            <div key={header} className="grid grid-cols-[80px_1fr] gap-2 items-start text-xs border-b border-border pb-1 last:border-0">
                                <span className="font-bold text-muted-foreground truncate py-0.5" title={header}>{header}</span>
                                <div className="bg-sidebar-accent/30 text-primary px-1.5 py-0.5 rounded-sm break-all font-mono text-[10px] min-h-[20px]">
                                    {currentRowData[header] || <span className="opacity-30 italic">null</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 opacity-50 text-xs text-muted-foreground">Empty Row</div>
                )}
            </div>
        </div>
    );
}
