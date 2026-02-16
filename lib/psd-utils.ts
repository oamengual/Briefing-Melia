import { readPsd } from 'ag-psd';
import { EditorLayer, EditorState } from '@/lib/types';

// Helper: Convert RGB to Hex
function rgbToHex(r?: number, g?: number, b?: number) {
    if (r === undefined || g === undefined || b === undefined) return '#000000';
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}

// Robust Layer Processor
export const processLayer = (layer: any): EditorLayer => {
    const isGroup = layer.children && layer.children.length > 0;
    const isText = !!layer.text;
    const type = isGroup ? 'group' : (isText ? 'text' : 'image');

    // Dimensions & Position
    const left = layer.left || 0;
    const top = layer.top || 0;
    const width = layer.width || 0;
    const height = layer.height || 0;

    // Blend Mode
    let blendMode = 'normal';
    if (layer.blendMode) {
        const bm = layer.blendMode.trim().toLowerCase();
        if (['multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'].includes(bm)) {
            blendMode = bm;
        }
    }

    // Image Extraction
    let src = '';
    if (type === 'image') {
        if (layer.canvas) {
            try {
                src = layer.canvas.toDataURL();
            } catch (e) {
                console.error("Failed to extract canvas data", e);
            }
        } else if (layer.imageData) {
            try {
                const c = document.createElement('canvas'); // Note: This runs in browser env
                c.width = layer.imageData.width;
                c.height = layer.imageData.height;
                const ctx = c.getContext('2d');
                if (ctx) {
                    ctx.putImageData(layer.imageData, 0, 0);
                    src = c.toDataURL();
                }
            } catch (e) {
                console.warn(`Failed to create canvas from imageData for layer "${layer.name}"`, e);
            }
        }
    }

    // Text Extraction
    const textProps: Partial<EditorLayer> = {};
    if (isText && layer.text) {
        const style = layer.text.style;
        const paragraph = layer.text.paragraphStyle;
        const transform = layer.text.transform; // [xx, xy, yx, yy, tx, ty]

        // 1. Text Content: Fix line breaks (\r -> \n)
        let rawText = layer.text.text || '';
        rawText = rawText.replace(/\r/g, '\n');

        if (style) {
            // 2. Font Size & Transforms
            // transform[0] is X scale, transform[3] is Y scale (roughly, assuming no rotation)
            let scaleX = 1;
            let scaleY = 1;
            if (transform && transform.length >= 4) {
                scaleX = transform[0];
                scaleY = transform[3];
            }
            // Use the larger scale to avoid squishing, or average? Usually text scales uniformly.
            const scale = Math.max(scaleX, scaleY);

            // Apply scale to fontSize
            if (style.fontSize) {
                textProps.fontSize = style.fontSize * scale;
            } else {
                textProps.fontSize = 24 * scale;
            }

            if (style.fillColor) textProps.color = rgbToHex(style.fillColor.r, style.fillColor.g, style.fillColor.b);
            if (style.font) textProps.fontFamily = style.font.name;

            // Tracking (Letter Spacing)
            // Photoshop tracking is 1/1000 em.
            if (style.tracking) {
                textProps.letterSpacing = style.tracking / 1000;
            }

            // Leading (Line Height)
            // Check if autoLeading is off? If leading is set, use it.
            // Scale leading as well
            if (style.leading) {
                textProps.lineHeight = style.leading * scale;
            }
        }

        // 3. Paragraph Alignment
        if (paragraph) {
            if (paragraph.justification) {
                const alignMap: Record<string, string> = {
                    'left': 'left',
                    'right': 'right',
                    'center': 'center',
                    'justify': 'justify',
                    'justifyAll': 'justify'
                };
                textProps.textAlign = alignMap[paragraph.justification] as any || 'left';
            }
        }

        // 4. Auto-Sizing behavior
        // PSD text usually has a bounding box. If we just dump text in, it might overflow.
        // We should respect the file's width/height for the box.
        textProps.wrapText = true;

        // Override text content
        // @ts-ignore
        layer.text.text = rawText; // Update original object for next reads if any?
    }

    // Recursive Children
    let children: EditorLayer[] = [];
    if (layer.children) {
        children = layer.children.map((child: any) => processLayer(child));
    }

    return {
        id: crypto.randomUUID(),
        name: layer.name || (type === 'group' ? 'Group' : 'Layer'),
        type,
        visible: layer.hidden !== true,
        left,
        top,
        width,
        height,
        opacity: layer.opacity != null ? layer.opacity : 1,
        text: isText ? (layer.text?.text || '').replace(/\r/g, '\n') : undefined,
        src,
        children: children.length > 0 ? children : undefined,
        autoSize: false,
        ...textProps
    };
};

export const parsePsd = async (file: File): Promise<{ state: Partial<EditorState>; preview?: string }> => {
    const arrayBuffer = await file.arrayBuffer();
    const psd = readPsd(arrayBuffer, {
        skipLayerImageData: false,
        useImageData: true,
        skipThumbnail: false,
    });

    console.log('PSD Import:', psd);

    let preview: string | undefined;
    if (psd.canvas) {
        preview = psd.canvas.toDataURL();
        // Thumbnail handling logic removed or simplified
    }

    const layers: EditorLayer[] = [];
    if (psd.children) {
        psd.children.forEach(node => {
            layers.push(processLayer(node));
        });
    }

    const padding = 80;
    // Window fallback if SSR?
    const availableW = typeof window !== 'undefined' ? window.innerWidth - 300 : 1000;
    const availableH = typeof window !== 'undefined' ? window.innerHeight - 100 : 800;
    const scaleW = availableW / psd.width;
    const scaleH = availableH / psd.height;
    const fitScale = Math.min(scaleW, scaleH, 0.9);

    return {
        state: {
            width: psd.width,
            height: psd.height,
            layers,
            scale: fitScale || 0.5,
            pan: { x: 0, y: 0 },
            selectedLayerIds: [],
            activeTool: 'move',
            currentFeedRow: 0,
            feedData: undefined
        },
        preview
    };
};
