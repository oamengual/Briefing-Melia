import { EditorState } from '@/lib/types';
import { Brief } from '@/lib/types';

export interface Template {
    id: string;
    name: string;
    size: string;
    channel?: string;
    preview?: string;
    editorState?: EditorState;
}

export interface FeedRow {
    id: string;
    filename: string;
    filenamePattern?: string;
    market: string;
    marketSelector?: string;
    width: number;
    height: number;
    [key: string]: any;
}

export interface VariantItem {
    id: string;
    row: FeedRow;
    rowIdx: number;
    activePlacements: string[];
}

export interface VariantGroup {
    tpl: Template;
    variants: VariantItem[];
}

export interface ExportPreviewProps {
    templates: Template[];
    brief: Brief | null;
    onClose?: () => void;
    onLoadState?: (id: string) => void;
}
