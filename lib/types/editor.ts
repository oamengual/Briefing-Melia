
export interface EditorLayer {
    id: string;
    name: string;
    type: 'text' | 'image' | 'group';
    visible: boolean;
    // Position & Size
    left: number;
    top: number;
    width: number;
    height: number;
    // Style
    opacity: number; // 0-1
    blendMode?: string; // normal, multiply, screen, overlay, darken, lighten, color-dodge, color-burn, hard-light, soft-light, difference, exclusion, hue, saturation, color, luminosity
    rotation?: number; // degrees
    // Text Properties
    fontSize?: number;
    fontFamily?: string;
    color?: string; // hex or rgba
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    autoSize?: boolean; // If true, box fits text.
    shrinkToFit?: boolean; // If true (and autoSize false), text scales down to fit box.
    wrapText?: boolean; // If true, multiline. If false, single line.
    letterSpacing?: number;
    lineHeight?: number;
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';

    // Background & Spacing
    backgroundColor?: string;
    padding?: { top: number; right: number; bottom: number; left: number };
    borderRadius?: { tl: number; tr: number; br: number; bl: number };

    // Content
    text?: string;
    src?: string; // For images (base64 or url)
    children?: EditorLayer[]; // For Groups
    // Binding
    variableName?: string; // e.g. "Product_Name"
}

export interface EditorState {
    width: number;
    height: number;
    layers: EditorLayer[];
    selectedLayerIds: string[]; // Replaces single ID
    scale: number; // Viewport scale
    pan: { x: number, y: number }; // Viewport pan offset
    layerSnapshot?: EditorLayer[]; // For stable transformations

    // Feed Data
    feedData?: {
        headers: string[];
        rows: Record<string, string | number | boolean | null>[];
    };
    currentFeedRow: number; // 0-indexed
    activeTool: 'move' | 'hand' | 'text' | 'image' | 'rect';
}
