'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

export default function TemplatesPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Templates</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="bg-white border-slate-200 shadow-sm hover:border-indigo-300 cursor-pointer transition-all">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <Layers className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-slate-800">Standard Retail Matrix</h3>
                            <p className="text-sm text-slate-500 mt-2">Pre-configured setup for Flash Sales in EMEA/AME.</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
